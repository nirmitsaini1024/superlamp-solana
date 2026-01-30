import React from 'react';
import { formatDate } from './helpers';

interface NoWebhookEndpointsTemplateProps {
  projectName: string;
  eventType: string;
  eventId: string;
  occurredAt: string;
  txHash?: string;
}

export const NoWebhookEndpointsTemplate: React.FC<NoWebhookEndpointsTemplateProps> = ({
  projectName,
  eventType,
  eventId,
  occurredAt,
  txHash
}) => {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid #e9ecef'
        }}>
          <h1 style={{
            color: '#ffc107',
            fontSize: '28px',
            margin: '0 0 10px 0',
            fontWeight: 'bold'
          }}>
            ⚠️ No Webhook Endpoints Configured
          </h1>
          <p style={{
            color: '#6c757d',
            fontSize: '16px',
            margin: '0'
          }}>
            {projectName}
          </p>
          <p style={{
            color: '#856404',
            fontSize: '14px',
            margin: '5px 0 0 0',
            fontWeight: '500'
          }}>
            Webhook notifications cannot be delivered
          </p>
        </div>

        {/* Event Details */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          padding: '20px',
          marginBottom: '25px'
        }}>
          <h2 style={{
            color: '#495057',
            fontSize: '20px',
            margin: '0 0 15px 0',
            fontWeight: '600'
          }}>
            Event Details
          </h2>
          
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#495057' }}>Event Type:</strong>
            <span style={{ color: '#6c757d', marginLeft: '10px' }}>
              {eventType}
            </span>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#495057' }}>Event ID:</strong>
            <span style={{ 
              color: '#007bff',
              fontFamily: 'monospace',
              marginLeft: '10px',
              wordBreak: 'break-all'
            }}>
              {eventId}
            </span>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#495057' }}>Occurred At:</strong>
            <span style={{ color: '#6c757d', marginLeft: '10px' }}>
              {formatDate(occurredAt)}
            </span>
          </div>

          {txHash && (
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#495057' }}>Transaction Hash:</strong>
              <a 
                href={`https://solscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  color: '#007bff',
                  fontFamily: 'monospace',
                  marginLeft: '10px',
                  textDecoration: 'none',
                  wordBreak: 'break-all'
                }}
              >
                {txHash}
              </a>
            </div>
          )}
        </div>

        {/* Warning Message */}
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '6px',
          padding: '20px',
          marginBottom: '25px'
        }}>
          <h3 style={{
            color: '#856404',
            fontSize: '18px',
            margin: '0 0 10px 0',
            fontWeight: '600'
          }}>
            🚨 Important Notice
          </h3>
          <p style={{
            color: '#856404',
            margin: '0 0 15px 0',
            lineHeight: '1.5'
          }}>
            This {eventType.toLowerCase()} event occurred, but no webhook endpoints are configured for your project. 
            This means your application will not receive real-time notifications about this event.
          </p>
          <p style={{
            color: '#856404',
            margin: '0',
            lineHeight: '1.5'
          }}>
            <strong>To receive webhook notifications:</strong>
          </p>
          <ol style={{
            color: '#856404',
            margin: '10px 0 0 20px',
            padding: '0'
          }}>
            <li>Go to your project dashboard</li>
            <li>Navigate to the Webhooks section</li>
            <li>Add a webhook endpoint URL</li>
            <li>Configure which events you want to receive</li>
          </ol>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          paddingTop: '20px',
          borderTop: '1px solid #e9ecef',
          color: '#6c757d',
          fontSize: '14px'
        }}>
          <p style={{ margin: '0 0 10px 0' }}>
            This is an automated notification about a missed webhook delivery in your Superlamp payment system.
          </p>
          <p style={{ margin: '0' }}>
            Powered by <strong>Superlamp</strong> - Solana Payment Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
};

// Export the HTML string version for email sending
export const getNoWebhookEndpointsTemplateHTML = (props: NoWebhookEndpointsTemplateProps): string => {
  const { 
    projectName, 
    eventType, 
    eventId, 
    occurredAt,
    txHash
  } = props;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>No Webhook Endpoints - ${projectName}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e9ecef;">
            <h1 style="color: #ffc107; font-size: 28px; margin: 0 0 10px 0; font-weight: bold;">
              ⚠️ No Webhook Endpoints Configured
            </h1>
            <p style="color: #6c757d; font-size: 16px; margin: 0;">
              ${projectName}
            </p>
            <p style="color: #856404; font-size: 14px; margin: 5px 0 0 0; font-weight: 500;">
              Webhook notifications cannot be delivered
            </p>
          </div>

          <!-- Event Details -->
          <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 25px;">
            <h2 style="color: #495057; font-size: 20px; margin: 0 0 15px 0; font-weight: 600;">
              Event Details
            </h2>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #495057;">Event Type:</strong>
              <span style="color: #6c757d; margin-left: 10px;">
                ${eventType}
              </span>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #495057;">Event ID:</strong>
              <span style="color: #007bff; font-family: monospace; margin-left: 10px; word-break: break-all;">
                ${eventId}
              </span>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #495057;">Occurred At:</strong>
              <span style="color: #6c757d; margin-left: 10px;">
                ${formatDate(occurredAt)}
              </span>
            </div>

            ${txHash ? `
            <div style="margin-bottom: 15px;">
              <strong style="color: #495057;">Transaction Hash:</strong>
              <a 
                href="https://solscan.io/tx/${txHash}"
                target="_blank"
                rel="noopener noreferrer"
                style="color: #007bff; font-family: monospace; margin-left: 10px; text-decoration: none; word-break: break-all;"
              >
                ${txHash}
              </a>
            </div>
            ` : ''}
          </div>

          <!-- Warning Message -->
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #856404; font-size: 18px; margin: 0 0 10px 0; font-weight: 600;">
              🚨 Important Notice
            </h3>
            <p style="color: #856404; margin: 0 0 15px 0; line-height: 1.5;">
              This ${eventType.toLowerCase()} event occurred, but no webhook endpoints are configured for your project. 
              This means your application will not receive real-time notifications about this event.
            </p>
            <p style="color: #856404; margin: 0; line-height: 1.5;">
              <strong>To receive webhook notifications:</strong>
            </p>
            <ol style="color: #856404; margin: 10px 0 0 20px; padding: 0;">
              <li>Go to your project dashboard</li>
              <li>Navigate to the Webhooks section</li>
              <li>Add a webhook endpoint URL</li>
              <li>Configure which events you want to receive</li>
            </ol>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 14px;">
            <p style="margin: 0 0 10px 0;">
              This is an automated notification about a missed webhook delivery in your Superlamp payment system.
            </p>
            <p style="margin: 0;">
              Powered by <strong>Superlamp</strong> - Solana Payment Infrastructure
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
