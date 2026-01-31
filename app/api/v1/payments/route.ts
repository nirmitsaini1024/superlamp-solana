import prisma from "@/db";
import { hashValue } from "@/lib/helpers";
import { NextRequest, NextResponse } from "next/server";
import { inputSchema } from "./types";
import { withPaymentRateLimit } from "../rate-limiter/middleware";

// Helper function to add CORS headers
function addCorsHeaders(response: NextResponse): NextResponse {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Superlamp-KEY, Idempotency-Key')
    response.headers.set('Access-Control-Max-Age', '86400')
    return response
}

async function paymentHandler(req: NextRequest) {
    try{
        const apiKey = req.headers.get('X-Superlamp-KEY');
        const idempotencyKey = req.headers.get('Idempotency-Key');
        
    if (!apiKey) {
        const response = NextResponse.json({ sessionId: null, error: "API key is required" }, { status: 400 })
        return addCorsHeaders(response)
    }
    
    const body = await req.json();
    const result = await inputSchema.safeParseAsync(body);
    if (!result.success) {
        const errorMessage = result.error.issues.map(i => i.message).join('; ');
        const response = NextResponse.json({ sessionId: null, error: `Validation error: ${errorMessage}` }, { status: 400 })
        return addCorsHeaders(response)
    }
    
    const { products, metadata } = result.data;
    const hashedApiToken = hashValue(apiKey);
    
    try {
        const result = await prisma.$transaction(async (tx) => {
            const tokenInfo = await tx.apiToken.findFirst({
                where: {
                    tokenHash: hashedApiToken,
                    status: 'ACTIVE'
                },
                include: { 
                    project: {
                        include: {
                            user: {
                                select: { walletAddress: true }
                            }
                        }
                    }
                }
            });
            
            if (!tokenInfo) {
                throw new Error('INVALID_API_KEY');
            }
            
            if (idempotencyKey) {
                const existingPayment = await tx.payment.findUnique({
                    where: { idempotencyKey },
                    include: {
                        project: {
                            include: {
                                user: {
                                    select: { walletAddress: true }
                                }
                            }
                        },
                        events: true
                    }
                });
                
                if (existingPayment) {
                    return {
                        isExisting: true,
                        payment: existingPayment,
                        walletAddress: existingPayment.project.user.walletAddress
                    };
                }
            }
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const eventMetadata: any = (() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const base: any = {};
                if (metadata !== undefined) {
                    if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
                        Object.assign(base, metadata as Record<string, unknown>);
                    } else {
                        base.user = metadata;
                    }
                }
                return base;
            })();
            
            
            // Sum total amount from products (store as micro units)
            const totalMicros = products.reduce((acc, p) => acc + Math.round(p.price * 1_000_000), 0);
            if (!Number.isFinite(totalMicros) || totalMicros <= 0) {
                throw new Error('INVALID_AMOUNT');
            }
            
            const payment = await tx.payment.create({
                data: {
                    projectId: tokenInfo.projectId,
                    tokenId: tokenInfo.id,
                    amount: BigInt(totalMicros),
                    idempotencyKey: idempotencyKey ?? null,
                    recipientAddress: tokenInfo.project.user.walletAddress!,
                    products: {
                        create: products.map((p) => ({
                            name: p.name,
                            price: BigInt(Math.round(p.price * 1_000_000)),
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            metadata: p.metadata ? (p.metadata as any) : undefined,
                        })),
                    },
                    events: {
                        create: {
                            projectId: tokenInfo.projectId,
                            type: "PAYMENT",
                            tokenId: tokenInfo.id,
                            metadata: eventMetadata
                        }
                    }
                },
                include: {
                    events: true
                }
            });

            await tx.apiToken.update({
                where: { id: tokenInfo.id },
                data: { 
                    lastUsedAt: new Date(), 
                    requestCount: { increment: 1 } 
                }
            });
            
            return {
                isExisting: false,
                payment,
                walletAddress: tokenInfo.project.user.walletAddress
            };
        });

        // Ensure we have an event with sessionId
        const event = result.payment.events[0];
        if (!event?.sessionId) {
            throw new Error('Failed to create event with sessionId');
        }
        
        const response = NextResponse.json({ sessionId: event.sessionId, error: null })
        return addCorsHeaders(response)
        
    } catch (error: unknown) {
        // Handle specific errors
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // Type-safe access to Prisma error properties
        interface PrismaError extends Error {
            code?: string;
            meta?: {
                target?: string[];
            };
        }
        
        const prismaError = error as PrismaError;
        const errorCode = prismaError.code;
        const errorMeta = prismaError.meta;
        
        if (errorMessage === 'INVALID_API_KEY') {
            const response = NextResponse.json({ sessionId: null, error: "Invalid or inactive API key" }, { status: 401 })
            return addCorsHeaders(response)
        }
        
        if (errorMessage === 'INVALID_AMOUNT') {
            const response = NextResponse.json({ sessionId: null, error: "Invalid payment amount" }, { status: 400 })
            return addCorsHeaders(response)
        }
        
        if (errorMessage === 'Failed to create event with sessionId') {
            const response = NextResponse.json({ sessionId: null, error: "Failed to create payment session" }, { status: 500 })
            return addCorsHeaders(response)
        }
        
        if (errorMessage === 'Existing payment missing event sessionId') {
            const response = NextResponse.json({ sessionId: null, error: "Existing payment session is invalid" }, { status: 500 })
            return addCorsHeaders(response)
        }
        
        // Handle unique constraint violations (race condition fallback)
        if (errorCode === 'P2002' && errorMeta?.target?.includes('idempotencyKey') && idempotencyKey) {
            // Fallback: fetch the existing payment that was created
            const existingPayment = await prisma.payment.findUnique({
                where: { idempotencyKey },
                include: {
                    project: {
                        include: {
                            user: {
                                select: { walletAddress: true }
                            }
                        }
                    },
                    events: true
                }
            });

            if (existingPayment) {
                const event = existingPayment.events[0];
                if (!event?.sessionId) {
                    throw new Error('Existing payment missing event sessionId');
                }
                const response = NextResponse.json({ sessionId: event.sessionId, error: null })
                return addCorsHeaders(response)
            }
        }
        
        const response = NextResponse.json({ sessionId: null, error: "An unexpected error occurred" }, { status: 500 })
        return addCorsHeaders(response)
    }
}
catch(e){
    console.error(e);
    const response = NextResponse.json({
        msg:"Internal server error"
    },{
        status:500
    })
    return addCorsHeaders(response)
}
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(req: NextRequest) {
    const response = new NextResponse(null, { status: 204 })
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Superlamp-KEY, Idempotency-Key')
    response.headers.set('Access-Control-Max-Age', '86400')
    return response
}

// Export the POST function with rate limiting applied
export const POST = await withPaymentRateLimit(paymentHandler);