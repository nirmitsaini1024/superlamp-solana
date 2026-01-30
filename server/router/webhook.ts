import { protectedProcedure, router } from "../trpc";
import { createWebhookSchema, createWebhookSchemaResponse, getSecretForWebhookSchema, getSecretForWebhookSchemaResponse, listWebhooksByProjectSchema, listWebhooksByProjectSchemaResponse, sampleTestingWebhookSchema, sampleTestingWebhookSchemaResponse, updateWebhookSchema, updateWebhookSchemaResponse } from "@/types/webhook";
import prisma from "@/db";
import { TRPCError } from "@trpc/server";
import { encryptData, generateWebhookSecret, decryptData } from "@/lib/helpers";


const createWebhook =protectedProcedure
.input(createWebhookSchema).
output(createWebhookSchemaResponse)
.mutation(async ({input,ctx})=>{

    const {projectId,url,description} = input;

    const projectExists = await prisma.project.count({
        where:{
            id:projectId,
            userId:ctx.session?.user.id
        }
    })>0

    if(!projectExists){
        throw new TRPCError({
            code: "NOT_FOUND",
            message:" Project does not exist"
        })
    }

    // Check if webhook with same URL already exists for this project
    const existingWebhook = await prisma.webhookEndpoint.findFirst({
        where:{
            projectId: projectId,
            url: url,
            status: {
                not: "REVOKED" // Only check non-revoked webhooks
            }
        }
    })

    if(existingWebhook){
        throw new TRPCError({
            code: "CONFLICT",
            message: "A webhook with this URL already exists for this project"
        })
    }

    const rawWebhookSecret = generateWebhookSecret();
    const encryptedWebhookSecret = await encryptData(rawWebhookSecret)
  
    const validWebhook = await prisma.webhookEndpoint.create({
      data: {
        url: url,
        secret: encryptedWebhookSecret,
        description: description,
        eventTypes: [],
        projectId: projectId
      }
    });

    return {
        id: validWebhook.id,
        url: validWebhook.url,
        secret: rawWebhookSecret,
        description: validWebhook.description,
        status: validWebhook.status,
        createdAt: validWebhook.createdAt
    }
  

})




const listWebhooksForProjectQuery = protectedProcedure
.input(listWebhooksByProjectSchema)
.output(listWebhooksByProjectSchemaResponse.array())
.query( async ({input,ctx})=>{

    const {projectId} = input;

    const projectWithWebhooks = await prisma.project.findFirst({
        where:{
            id:projectId,
            userId:ctx.session?.user.id
        },
        include:{
            webhookEndpoints:{
                select:{
                    id:true,
                    url:true,
                    description:true,
                    secret:true,
                    status:true,
                    createdAt:true,
                    lastTimeHit:true
                }
            }
        }
    })

    if(!projectWithWebhooks){
        throw new TRPCError({
            code:"NOT_FOUND",
            message:"Project not found for the user"
        })
    }

    // Decrypt secrets before returning
    const decryptedWebhooks = await Promise.all(
        projectWithWebhooks.webhookEndpoints.map(async (webhook) => ({
            ...webhook,
            secret: await decryptData<string>(webhook.secret)
        }))
    );

    return decryptedWebhooks
})



const getSecretForWebhook = protectedProcedure
.input(getSecretForWebhookSchema)
.output(getSecretForWebhookSchemaResponse)
.query(
    async ({input,ctx})=>{

        const {id} = input;

        const webhook = await prisma.webhookEndpoint.findUnique({
            where:{
                id:id,
                project:{
                    userId:ctx.session.user.id
                }
            },
            select:{
                secret:true
            }
        })

        if(!webhook){
            throw new TRPCError({
                code:"NOT_FOUND",
                message:"Webhook not found"
            })
        }

        const decryptedSecret = await decryptData<string>(webhook.secret)
        return {
            secret:decryptedSecret
        }
    }
)


const updateWebhookStatus = protectedProcedure
.input(updateWebhookSchema)
.output(updateWebhookSchemaResponse)
.mutation(
    async ({input,ctx})=>{

        const {id,status} = input;

        await prisma.webhookEndpoint.update({
            where:{
                id:id,
                project:{
                    userId:ctx.session.user.id
                }
            },
            data:{
                status: status
            }
        })
        return {
            id:id,
            status:status
        }

    }
) 




const sampleWebhookTesting = protectedProcedure
.input(sampleTestingWebhookSchema)
.output(sampleTestingWebhookSchemaResponse)
.mutation(async ({ctx,input})=>{
    const {id} = input;

    // Get the webhook endpoint
    const webhook = await prisma.webhookEndpoint.findUnique({
        where:{
            id:id,
            project:{
                userId:ctx.session.user.id
            }
        },
        select:{
            url:true,
            secret:true,
            status:true
        }
    })

    if(!webhook){
        throw new TRPCError({
            code:"NOT_FOUND",
            message:"Webhook not found"
        })
    }

    if(webhook.status !== 'ACTIVE'){
        throw new TRPCError({
            code:"BAD_REQUEST",
            message:"Webhook must be active to test"
        })
    }

    // Decrypt the secret
    const decryptedSecret = await decryptData<string>(webhook.secret)

    // Create sample webhook payload matching OkitoWebhookEventSchema
    const samplePayload = {
        id: "test_" + Date.now(),
        type: "WEBHOOK_TEST" as const,
        createdAt: Date.now(),
        data: {
            sessionId: "test_session_" + Date.now(),
            paymentId: "test_payment_" + Date.now(),
            amount: 1000000, // 1 USDC in micro units
            currency: "USDC",
            network: "testing-webhook",
            status: "testing",
            metadata: {
                test: true,
                source: "webhook_test_tool"
            },
            walletAddress: "test_wallet_address",
            tokenMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC mint
            transactionSignature: "0x" + "a".repeat(64),
            blockNumber: 123456,
            confirmedAt: new Date().toISOString(),
            products: [
                {
                    id: "test_product_1",
                    name: "Test Product",
                    price: 1000000,
                    metadata: {
                        description: "This is a test product",
                        category: "test"
                    }
                }
            ]
        }
    }

    try {
        // Send the webhook
        const response = await fetch(webhook.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Okito-Signature': decryptedSecret,
                'User-Agent': 'Okito-Webhook/1.0'
            },
            body: JSON.stringify(samplePayload),
            signal: AbortSignal.timeout(10000) // 10 second timeout
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return {
            message: `Test webhook sent successfully to ${webhook.url}`
        }
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to send test webhook: ${error instanceof Error ? error.message : 'Unknown error'}`
        })
    }
})



export const webhookRouter = router({
    create: createWebhook,
    list: listWebhooksForProjectQuery,
    getSecret:getSecretForWebhook,
    updateStatus:updateWebhookStatus,
    test: sampleWebhookTesting
})



