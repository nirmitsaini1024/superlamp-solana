export { SaleTemplate, getSaleTemplateHTML } from './SaleTemplate';
export { WebhookFailureTemplate, getWebhookFailureTemplateHTML } from './WebhookFailureTemplate';
export { NoWebhookEndpointsTemplate, getNoWebhookEndpointsTemplateHTML } from './NoWebhookEndpointsTemplate';
export * from './helpers';
import { getSaleTemplateHTML } from './SaleTemplate';
import { getWebhookFailureTemplateHTML } from './WebhookFailureTemplate';
import { getNoWebhookEndpointsTemplateHTML } from './NoWebhookEndpointsTemplate';

// Union type for all possible template props
type TemplateProps = EmailTemplateProps | {
  projectName: string;
  webhookUrl: string;
  errorMessage: string;
  eventType: string;
  eventId: string;
  failedAt: string;
  retryAttempts: number;
  txHash?: string;
} | {
  projectName: string;
  eventType: string;
  eventId: string;
  occurredAt: string;
  txHash?: string;
};
// Template types
export interface EmailTemplateProps {
  projectName: string;
  customerEmail?: string;
  customerWalletAddress: string;
  amount: number;
  currency: string;
  transactionSignature: string;
  products: Array<{
    name: string;
    price: number;
    quantity?: number;
  }>;
  network: string;
  confirmedAt: string;
}

// Template types enum
export enum EmailTemplateType {
  SALE_NOTIFICATION = 'sale_notification',
  PAYMENT_FAILED = 'payment_failed',
  PAYMENT_PENDING = 'payment_pending',
  WEBHOOK_FAILURE = 'webhook_failure',
  NO_WEBHOOK_ENDPOINTS = 'no_webhook_endpoints',
  // Add more template types as needed
}

// Template factory function
export const getEmailTemplate = (type: EmailTemplateType, props: TemplateProps) => {
  switch (type) {
    case EmailTemplateType.SALE_NOTIFICATION:
      return getSaleTemplateHTML(props as EmailTemplateProps);
    case EmailTemplateType.WEBHOOK_FAILURE:
      return getWebhookFailureTemplateHTML(props as {
        projectName: string;
        webhookUrl: string;
        errorMessage: string;
        eventType: string;
        eventId: string;
        failedAt: string;
        retryAttempts: number;
        txHash?: string;
      });
    case EmailTemplateType.NO_WEBHOOK_ENDPOINTS:
      return getNoWebhookEndpointsTemplateHTML(props as {
        projectName: string;
        eventType: string;
        eventId: string;
        occurredAt: string;
        txHash?: string;
      });
    default:
      throw new Error(`Unknown email template type: ${type}`);
  }
};
