import React from 'react';
import { formatDate } from './helpers';

interface WebhookFailureTemplateProps {
  projectName: string;
  webhookUrl: string;
  errorMessage: string;
  eventType: string;
  eventId: string;
  failedAt: string;
  retryAttempts: number;
  txHash?: string;
}

export const WebhookFailureTemplate: React.FC<WebhookFailureTemplateProps> = ({
  projectName,
  webhookUrl,
  errorMessage,
  eventType,
  eventId,
  failedAt,
  retryAttempts,
  txHash
}) => {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      maxWidth: '640px',
      margin: '0 auto',
      backgroundColor: '#fafafa',
      padding: '0'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        padding: '32px 24px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <div style={{
            fontSize: '32px',
            lineHeight: '1'
          }}>⚠️</div>
        </div>
        <h1 style={{
          color: '#ffffff',
          fontSize: '24px',
          fontWeight: '700',
          margin: '0 0 8px 0',
          letterSpacing: '-0.5px'
        }}>
          Webhook Delivery Failed
        </h1>
        <p style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '15px',
          margin: '0',
          fontWeight: '500'
        }}>
          {projectName}
        </p>
      </div>

      {/* Alert Banner */}
      <div style={{
        backgroundColor: '#fef2f2',
        margin: '24px 24px 0 24px',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid #fecaca'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <div style={{
            fontSize: '20px',
            lineHeight: '1',
            flexShrink: 0
          }}>🚨</div>
          <div>
            <p style={{
              margin: '0 0 4px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#991b1b'
            }}>
              Endpoint Not Responding
            </p>
            <p style={{
              margin: '0',
              fontSize: '13px',
              color: '#b91c1c',
              lineHeight: '1.5'
            }}>
              Failed after {retryAttempts} retry {retryAttempts === 1 ? 'attempt' : 'attempts'}. Please check your webhook configuration.
            </p>
          </div>
        </div>
      </div>

      {/* Error Details */}
      <div style={{
        backgroundColor: '#ffffff',
        margin: '16px 24px 24px 24px',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          fontWeight: '600',
          color: '#111827'
        }}>
          Error Details
        </h2>
        
        <div style={{
          backgroundColor: '#fef2f2',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #fee2e2'
        }}>
          <p style={{
            margin: '0',
            fontSize: '13px',
            fontFamily: 'monospace',
            color: '#991b1b',
            lineHeight: '1.6'
          }}>
            {errorMessage}
          </p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '12px 0', fontSize: '14px', color: '#6b7280', width: '40%' }}>Webhook URL</td>
              <td style={{ 
                padding: '12px 0', 
                fontSize: '13px', 
                color: '#111827',
                fontFamily: 'monospace',
                wordBreak: 'break-all'
              }}>
                {webhookUrl}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '12px 0', fontSize: '14px', color: '#6b7280', borderTop: '1px solid #f3f4f6' }}>Event Type</td>
              <td style={{ 
                padding: '12px 0', 
                fontSize: '14px', 
                color: '#111827',
                borderTop: '1px solid #f3f4f6'
              }}>
                <code style={{
                  backgroundColor: '#f3f4f6',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '13px'
                }}>{eventType}</code>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '12px 0', fontSize: '14px', color: '#6b7280', borderTop: '1px solid #f3f4f6' }}>Event ID</td>
              <td style={{ 
                padding: '12px 0', 
                fontSize: '13px', 
                color: '#111827',
                fontFamily: 'monospace',
                borderTop: '1px solid #f3f4f6'
              }}>
                {eventId}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '12px 0', fontSize: '14px', color: '#6b7280', borderTop: '1px solid #f3f4f6' }}>Failed At</td>
              <td style={{ 
                padding: '12px 0', 
                fontSize: '14px', 
                color: '#111827',
                borderTop: '1px solid #f3f4f6'
              }}>
                {new Date(failedAt).toLocaleString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </td>
            </tr>
            {txHash && (
              <tr>
                <td style={{ padding: '12px 0', fontSize: '14px', color: '#6b7280', borderTop: '1px solid #f3f4f6' }}>Transaction</td>
                <td style={{ 
                  padding: '12px 0', 
                  fontSize: '13px', 
                  fontFamily: 'monospace',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  <a 
                    href={`https://solscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#2563eb',
                      textDecoration: 'none'
                    }}
                  >
                    {txHash.slice(0, 12)}...{txHash.slice(-8)}
                  </a>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Action Required */}
      <div style={{
        backgroundColor: '#ffffff',
        margin: '0 24px 24px 24px',
        borderRadius: '12px',
        padding: '20px 24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <p style={{
          margin: '0 0 8px 0',
          fontSize: '14px',
          fontWeight: '600',
          color: '#111827'
        }}>
          Next Steps
        </p>
        <ul style={{
          margin: '0',
          padding: '0 0 0 20px',
          fontSize: '14px',
          color: '#6b7280',
          lineHeight: '1.8'
        }}>
          <li>Verify your webhook endpoint is accessible</li>
          <li>Check server logs for connection issues</li>
          <li>Update webhook URL if endpoint has changed</li>
        </ul>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '24px',
        color: '#9ca3af',
        fontSize: '13px',
        lineHeight: '1.6'
      }}>
        <p style={{ margin: '0 0 4px 0' }}>
          Powered by Superlamp
        </p>
        <p style={{ margin: '0' }}>
          Solana Payment Infrastructure
        </p>
      </div>
    </div>
  );
};

// Export the HTML string version for email sending
export const getWebhookFailureTemplateHTML = (props: WebhookFailureTemplateProps): string => {
  const { 
    projectName, 
    webhookUrl, 
    errorMessage, 
    eventType, 
    eventId, 
    failedAt, 
    retryAttempts,
    txHash
  } = props;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Webhook Failure - ${projectName}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e9ecef;">
            <h1 style="color: #dc3545; font-size: 28px; margin: 0 0 10px 0; font-weight: bold;">
              ⚠️ Webhook Delivery Failed
            </h1>
            <p style="color: #6c757d; font-size: 16px; margin: 0;">
              ${projectName}
            </p>
            <p style="color: #dc3545; font-size: 14px; margin: 5px 0 0 0; font-weight: 500;">
              Your webhook endpoint is not responding
            </p>
          </div>

          <!-- Failure Details -->
          <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 25px;">
            <h2 style="color: #495057; font-size: 20px; margin: 0 0 15px 0; font-weight: 600;">
              Failure Details
            </h2>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #495057;">Webhook URL:</strong>
              <span style="color: #007bff; font-family: monospace; margin-left: 10px; word-break: break-all;">
                ${webhookUrl}
              </span>
            </div>

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
              <strong style="color: #495057;">Retry Attempts:</strong>
              <span style="color: #dc3545; margin-left: 10px; font-weight: bold;">
                ${retryAttempts} attempts made
              </span>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #495057;">Failed At:</strong>
              <span style="color: #6c757d; margin-left: 10px;">
                ${formatDate(failedAt)}
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

            <div>
              <strong style="color: #495057;">Error Message:</strong>
              <div style="background-color: #fff5f5; border: 1px solid #fed7d7; border-radius: 4px; padding: 10px; margin-top: 5px; color: #c53030; font-family: monospace; font-size: 14px; word-break: break-word;">
                ${errorMessage}
              </div>
            </div>
          </div>


          <!-- Footer -->
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 14px;">
            <p style="margin: 0 0 10px 0;">
              This is an automated notification about a webhook delivery failure in your Superlamp payment system.
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
