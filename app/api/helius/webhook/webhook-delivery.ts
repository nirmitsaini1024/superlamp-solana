import { decryptData } from '../../../../lib/helpers';
import prisma from '@/db';
import { emailService } from '../../../../lib/email-service';
import { EmailTemplateType } from '../../../../lib/email-templates';

export interface WebhookEventPayload {
  id: string;
  type: 'PAYMENT';
  createdAt: string;
  data: {
    sessionId: string;
    paymentId: string;
    amount: number;
    currency?: 'USDC' | 'USDT';
    network?: string;
    status?: 'PENDING' | 'CONFIRMED' | 'FAILED';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: any;
    walletAddress?: string;
    tokenMint?: string;
    transactionSignature?: string;
    blockNumber?: number;
    confirmedAt?: string;
    products?: Array<{
      id: string;
      name: string;
      price: number;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metadata?: any;
    }>;
  };
}

// No longer needed - we'll just send the secret directly

/**
 * Calculate exponential backoff delay with jitter
 */
function calculateBackoffDelay(attempt: number, config: RetryConfig): number {
  const baseDelay = Math.pow(2, attempt - 1) * config.baseDelayMs;
  const jitter = Math.random() * config.jitterMs;
  return Math.min(baseDelay + jitter, config.maxDelayMs);
}

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  jitterMs: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000, // 1 second base delay
  maxDelayMs: 30000, // 30 seconds max delay
  jitterMs: 1000,    // 1 second jitter
};

export async function deliverWebhook(
  eventId: string,
  endpointId: string,
  payload: WebhookEventPayload,
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<{ success: boolean; httpStatusCode?: number; errorMessage?: string; responseBody?: string; attempts: number }> {
  const { maxRetries } = retryConfig;
  let lastError: Error | null = null;
  let attempts = 0;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    attempts = attempt;
    
    try {
      // Get webhook endpoint details
      const endpoint = await prisma.webhookEndpoint.findUnique({
        where: { id: endpointId },
      });

      if (!endpoint || endpoint.status !== 'ACTIVE') {
        throw new Error('Webhook endpoint not found or inactive');
      }

      // Decrypt the webhook secret
      const decryptedSecret = await decryptData<string>(endpoint.secret);
      
      // Create the payload
      const payloadString = JSON.stringify(payload);

      // Make the HTTP request with Authorization header
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Superlamp-Webhook/1.0',
          'Authorization': decryptedSecret,
          'X-Superlamp-Event-Id': eventId,
          'X-Superlamp-Event-Type': payload.type,
        },
        body: payloadString,
        // Add timeout
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      const responseBody = await response.text();

      // If successful, update endpoint and create delivery record
      if (response.ok) {
        // Update webhook endpoint last hit time
        await prisma.webhookEndpoint.update({
          where: { id: endpointId },
          data: { lastTimeHit: new Date() },
        });

        // Create event delivery record
        await prisma.eventDelivery.create({
          data: {
            eventId,
            endpointId,
            deliveryStatus: 'DELIVERED',
            httpStatusCode: response.status,
            responseBody: responseBody.slice(0, 1000), // Limit response body size
            deliveredAt: new Date(),
            errorMessage: null,
            attemptNumber: attempt,
          },
        });

        return {
          success: true,
          httpStatusCode: response.status,
          responseBody: responseBody.slice(0, 1000),
          attempts,
        };
      } else {
        // Create delivery record for failed attempt
        await prisma.eventDelivery.create({
          data: {
            eventId,
            endpointId,
            deliveryStatus: 'FAILED',
            httpStatusCode: response.status,
            responseBody: responseBody.slice(0, 1000),
            deliveredAt: null,
            errorMessage: `HTTP ${response.status}: ${response.statusText}`,
            attemptNumber: attempt,
          },
        });

        // If this is the last attempt, return failure
        if (attempt === maxRetries) {
          return {
            success: false,
            httpStatusCode: response.status,
            responseBody: responseBody.slice(0, 1000),
            errorMessage: `HTTP ${response.status}: ${response.statusText}`,
            attempts,
          };
        }

        // Wait before retrying with exponential backoff + jitter
        const delay = calculateBackoffDelay(attempt, retryConfig);
        console.log(`Webhook retry ${attempt}/${maxRetries} for endpoint ${endpointId}, waiting ${Math.round(delay)}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Create delivery record for failed attempt
      await prisma.eventDelivery.create({
        data: {
          eventId,
          endpointId,
          deliveryStatus: 'FAILED',
          errorMessage: lastError.message,
          attemptNumber: attempt,
        },
      });

      // If this is the last attempt, return failure
      if (attempt === maxRetries) {
        return {
          success: false,
          errorMessage: lastError.message,
          attempts,
        };
      }

      // Wait before retrying with exponential backoff + jitter
      const delay = calculateBackoffDelay(attempt, retryConfig);
      console.log(`Webhook retry ${attempt}/${maxRetries} for endpoint ${endpointId}, waiting ${Math.round(delay)}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // This should never be reached, but just in case
  return {
    success: false,
    errorMessage: lastError?.message || 'Max retries exceeded',
    attempts,
  };
}

export async function deliverWebhookToAllEndpoints(
  eventId: string,
  projectId: string,
  eventType: 'PAYMENT',
  payload: WebhookEventPayload,
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<{ failedEndpoints: Array<{ endpoint: { id: string; url: string; status: string }; errorMessage: string; attempts: number }>; noEndpointsConfigured: boolean }> {
  // Find all active webhook endpoints for this project that should receive this event type
  const endpoints = await prisma.webhookEndpoint.findMany({
    where: {
      projectId,
      status: 'ACTIVE',
      OR: [
        { eventTypes: { isEmpty: true } }, // Empty array means receive all events
        { eventTypes: { has: eventType } }, // Specific event type
      ],
    },
  });

  // If no endpoints are configured, send email notification
  if (endpoints.length === 0) {
    try {
      // Get project name for the email
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { name: true },
      });

      await emailService.sendNotification({
        projectId,
        templateType: EmailTemplateType.NO_WEBHOOK_ENDPOINTS,
        templateProps: {
          projectName: project?.name || 'Your Project',
          eventType,
          eventId,
          occurredAt: payload.createdAt,
          txHash: payload.data.transactionSignature,
        },
      });
      console.log(`Sent no webhook endpoints notification for project ${projectId}`);
    } catch (error) {
      console.error(`Failed to send no webhook endpoints notification for project ${projectId}:`, error);
    }

    return { failedEndpoints: [], noEndpointsConfigured: true };
  }

  // Deliver to all endpoints in parallel
  const deliveryPromises = endpoints.map(async endpoint => {
    try {
      const result = await deliverWebhook(eventId, endpoint.id, payload, retryConfig);
      return { endpoint, result };
    } catch (error) {
      console.error(`Failed to deliver webhook to endpoint ${endpoint.id}:`, error);
      return { 
        endpoint, 
        result: { 
          success: false, 
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          attempts: retryConfig.maxRetries
        } 
      };
    }
  });

  const results = await Promise.allSettled(deliveryPromises);
  
  // Collect failed endpoints
  const failedEndpoints: Array<{ endpoint: { id: string; url: string; status: string }; errorMessage: string; attempts: number }> = [];
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const { endpoint, result: deliveryResult } = result.value;
      if (!deliveryResult.success) {
        failedEndpoints.push({
          endpoint,
          errorMessage: deliveryResult.errorMessage || 'Unknown error',
          attempts: deliveryResult.attempts || 3
        });
      }
    } else {
      // If the promise itself was rejected, add the endpoint as failed
      const endpoint = endpoints[index];
      failedEndpoints.push({
        endpoint,
        errorMessage: result.reason?.message || 'Promise rejected',
        attempts: retryConfig.maxRetries
      });
    }
  });

  return { failedEndpoints, noEndpointsConfigured: false };
}
