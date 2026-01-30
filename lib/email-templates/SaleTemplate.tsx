import React from 'react';
import { formatDate, formatAmount, getNetworkDisplayName } from './helpers';

interface SaleTemplateProps {
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

export const SaleTemplate: React.FC<SaleTemplateProps> = ({
  projectName,
  customerEmail,
  customerWalletAddress,
  amount,
  currency,
  transactionSignature,
  products,
  network,
  confirmedAt
}) => {
  const totalAmount = formatAmount(amount);
  
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      maxWidth: '640px',
      margin: '0 auto',
      backgroundColor: '#fafafa',
      padding: '0'
    }}>
      {/* Header with gradient */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
          }}>💰</div>
        </div>
        <h1 style={{
          color: '#ffffff',
          fontSize: '24px',
          fontWeight: '700',
          margin: '0 0 8px 0',
          letterSpacing: '-0.5px'
        }}>
          Payment Received
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

      {/* Amount Card */}
      <div style={{
        backgroundColor: '#ffffff',
        margin: '24px',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          textAlign: 'center',
          paddingBottom: '20px',
          borderBottom: '1px solid #f3f4f6'
        }}>
          <p style={{
            margin: '0 0 4px 0',
            fontSize: '13px',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '600'
          }}>Total Amount</p>
          <p style={{
            margin: '0',
            fontSize: '36px',
            fontWeight: '700',
            color: '#111827',
            letterSpacing: '-1px'
          }}>
            {totalAmount} <span style={{ fontSize: '24px', color: '#6b7280' }}>{currency}</span>
          </p>
        </div>

        {/* Transaction Info */}
        <div style={{ marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '12px 0', fontSize: '14px', color: '#6b7280' }}>Customer</td>
                <td style={{ 
                  padding: '12px 0', 
                  fontSize: '14px', 
                  color: '#111827',
                  textAlign: 'right',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all'
                }}>
                  {customerWalletAddress.slice(0, 8)}...{customerWalletAddress.slice(-6)}
                </td>
              </tr>
              {customerEmail && (
                <tr>
                  <td style={{ padding: '12px 0', fontSize: '14px', color: '#6b7280', borderTop: '1px solid #f3f4f6' }}>Email</td>
                  <td style={{ 
                    padding: '12px 0', 
                    fontSize: '14px', 
                    color: '#111827',
                    textAlign: 'right',
                    borderTop: '1px solid #f3f4f6'
                  }}>
                    {customerEmail}
                  </td>
                </tr>
              )}
              <tr>
                <td style={{ padding: '12px 0', fontSize: '14px', color: '#6b7280', borderTop: '1px solid #f3f4f6' }}>Network</td>
                <td style={{ 
                  padding: '12px 0', 
                  fontSize: '14px', 
                  color: '#111827',
                  textAlign: 'right',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  {getNetworkDisplayName(network)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '12px 0', fontSize: '14px', color: '#6b7280', borderTop: '1px solid #f3f4f6' }}>Time</td>
                <td style={{ 
                  padding: '12px 0', 
                  fontSize: '14px', 
                  color: '#111827',
                  textAlign: 'right',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  {new Date(confirmedAt).toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Products */}
      <div style={{
        backgroundColor: '#ffffff',
        margin: '0 24px 24px 24px',
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
          Items
        </h2>
        <div style={{ borderTop: '1px solid #f3f4f6' }}>
          {products.map((product, index) => (
            <div key={index} style={{
              padding: '16px 0',
              borderBottom: index < products.length - 1 ? '1px solid #f3f4f6' : 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ flex: 1 }}>
                <p style={{
                  margin: '0 0 4px 0',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#111827'
                }}>
                  {product.name}
                </p>
                {product.quantity && (
                  <p style={{
                    margin: '0',
                    fontSize: '13px',
                    color: '#6b7280'
                  }}>
                    Qty: {product.quantity}
                  </p>
                )}
              </div>
              <div style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#111827',
                whiteSpace: 'nowrap',
                marginLeft: '16px'
              }}>
                {formatAmount(product.price)} {currency}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Hash */}
      <div style={{
        margin: '0 24px 24px 24px',
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <p style={{
          margin: '0 0 8px 0',
          fontSize: '12px',
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontWeight: '600'
        }}>Transaction Hash</p>
        <p style={{
          margin: '0',
          fontSize: '13px',
          fontFamily: 'monospace',
          color: '#111827',
          wordBreak: 'break-all',
          lineHeight: '1.6'
        }}>
          {transactionSignature}
        </p>
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
export const getSaleTemplateHTML = (props: SaleTemplateProps): string => {
  // This would be used by the email service to render the template to HTML
  // For now, we'll create a simple HTML version
  const { 
    projectName, 
    customerWalletAddress, 
    amount, 
    currency, 
    transactionSignature, 
    products, 
    network, 
    confirmedAt 
  } = props;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Sale - ${projectName}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e9ecef;">
            <h1 style="color: #28a745; font-size: 28px; margin: 0 0 10px 0; font-weight: bold;">
              🎉 New Sale Received!
            </h1>
            <p style="color: #6c757d; font-size: 16px; margin: 0;">
              ${projectName}
            </p>
            <p style="color: #28a745; font-size: 14px; margin: 5px 0 0 0; font-weight: 500;">
              You've received a new payment!
            </p>
          </div>

          <!-- Sale Details -->
          <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 25px;">
            <h2 style="color: #495057; font-size: 20px; margin: 0 0 15px 0; font-weight: 600;">
              Sale Details
            </h2>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #495057;">Amount:</strong>
              <span style="color: #28a745; font-size: 18px; font-weight: bold; margin-left: 10px;">
                ${formatAmount(amount)} ${currency}
              </span>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #495057;">Customer Wallet:</strong>
              <span style="color: #007bff; font-family: monospace; margin-left: 10px; word-break: break-all;">
                ${customerWalletAddress}
              </span>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #495057;">Network:</strong>
              <span style="color: #6c757d; margin-left: 10px;">
                ${getNetworkDisplayName(network)}
              </span>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #495057;">Transaction:</strong>
              <span style="color: #007bff; font-family: monospace; margin-left: 10px; word-break: break-all;">
                ${transactionSignature}
              </span>
            </div>

            <div>
              <strong style="color: #495057;">Confirmed At:</strong>
              <span style="color: #6c757d; margin-left: 10px;">
                ${formatDate(confirmedAt)}
              </span>
            </div>
          </div>

          <!-- Products -->
          <div style="margin-bottom: 25px;">
            <h2 style="color: #495057; font-size: 20px; margin: 0 0 15px 0; font-weight: 600;">
              Products Purchased
            </h2>
            
            <div style="background-color: #ffffff; border: 1px solid #dee2e6; border-radius: 6px; overflow: hidden;">
              ${products.map((product, index) => `
                <div style="padding: 15px; border-bottom: ${index < products.length - 1 ? '1px solid #dee2e6' : 'none'}; background-color: ${index % 2 === 0 ? '#ffffff' : '#f8f9fa'};">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <h3 style="margin: 0 0 5px 0; color: #495057; font-size: 16px; font-weight: 600;">
                        ${product.name}
                      </h3>
                      ${product.quantity ? `<p style="margin: 0; color: #6c757d; font-size: 14px;">Quantity: ${product.quantity}</p>` : ''}
                    </div>
                    <div style="color: #28a745; font-size: 16px; font-weight: bold;">
                      ${formatAmount(product.price)} ${currency}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 14px;">
            <p style="margin: 0 0 10px 0;">
              This is an automated notification about a new sale in your Superlamp payment system.
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
