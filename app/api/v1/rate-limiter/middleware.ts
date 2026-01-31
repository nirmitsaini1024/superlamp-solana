import { NextRequest } from 'next/server'
import { paymentRateLimit, strictRateLimit, createRateLimitResponse, getRateLimitIdentifier } from '.'

export async function withPaymentRateLimit(handler: (req: NextRequest) => Promise<Response>) {
    return async (req: NextRequest): Promise<Response> => {
        try {
            // Get request headers from req object
            const apiKey = req.headers.get('X-Superlamp-KEY')
            
            // Get client IP
            const forwarded = req.headers.get('x-forwarded-for')
            const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
            
            // Create identifier for rate limiting
            const identifier = getRateLimitIdentifier(apiKey, ip)
            
            // Apply strict rate limiting for requests without API key (potential abuse)
            const rateLimiter = apiKey ? paymentRateLimit : strictRateLimit
            
            // Check rate limit
            const { success, limit, remaining, reset } = await rateLimiter.limit(identifier)
            
            // Additional IP-based protection for potential DDoS
            if (success && !apiKey) {
                const ipIdentifier = `ip:${ip}`
                const ipRateLimit = await strictRateLimit.limit(ipIdentifier)
                if (!ipRateLimit.success) {
                    console.warn(`IP rate limit exceeded for ${ip}`, {
                        limit: ipRateLimit.limit,
                        remaining: ipRateLimit.remaining,
                        reset: new Date(ipRateLimit.reset).toISOString()
                    })
                    return createRateLimitResponse(ipRateLimit.limit, ipRateLimit.remaining, new Date(ipRateLimit.reset))
                }
            }
            
            if (!success) {
                console.warn(`Rate limit exceeded for ${identifier}`, {
                    limit,
                    remaining,
                    reset: new Date(reset).toISOString(),
                    userAgent: req.headers.get('user-agent'),
                    ip
                })
                
                return createRateLimitResponse(limit, remaining, new Date(reset))
            }
            
            // Add rate limit headers to response
            const response = await handler(req)
            
            // Add CORS headers
            response.headers.set('Access-Control-Allow-Origin', '*')
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Superlamp-KEY, Idempotency-Key')
            response.headers.set('Access-Control-Max-Age', '86400')
            
            response.headers.set('X-RateLimit-Limit', limit.toString())
            response.headers.set('X-RateLimit-Remaining', remaining.toString())
            response.headers.set('X-RateLimit-Reset', new Date(reset).toISOString())
            
            return response
            
        } catch (error) {
            console.error('Rate limiting error:', error)
            // If rate limiting fails, continue without rate limiting
            // This ensures the API remains functional even if Redis is down
            return handler(req)
        }
    }
}
