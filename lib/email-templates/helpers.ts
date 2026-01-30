/**
 * Shared utility functions for email templates
 */

/**
 * Format a date string to a human-readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
};

/**
 * Format an amount to a locale-specific number format
 * @param amount - Numeric amount
 * @returns Formatted amount string
 */
export const formatAmount = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  });
};

/**
 * Get a human-readable display name for Solana networks
 * @param network - Network identifier
 * @returns Display name for the network
 */
export const getNetworkDisplayName = (network: string): string => {
  switch (network) {
    case 'mainnet-beta':
      return 'Solana Mainnet';
    case 'devnet':
      return 'Solana Devnet';
    case 'testnet':
      return 'Solana Testnet';
    default:
      return network;
  }
};

/**
 * Truncate a string to a specified length with ellipsis
 * @param str - String to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
export const truncateString = (str: string, maxLength: number = 50): string => {
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength) + '...';
};

/**
 * Generate a Solscan transaction URL
 * @param txHash - Transaction hash
 * @returns Solscan URL for the transaction
 */
export const getSolscanUrl = (txHash: string): string => {
  return `https://solscan.io/tx/${txHash}`;
};

/**
 * Generate a Solana Explorer transaction URL
 * @param txHash - Transaction hash
 * @returns Solana Explorer URL for the transaction
 */
export const getSolanaExplorerUrl = (txHash: string): string => {
  return `https://explorer.solana.com/tx/${txHash}`;
};

/**
 * Format a wallet address for display (truncate middle part)
 * @param address - Wallet address
 * @param startChars - Number of characters to show at start
 * @param endChars - Number of characters to show at end
 * @returns Formatted wallet address
 */
export const formatWalletAddress = (
  address: string, 
  startChars: number = 6, 
  endChars: number = 4
): string => {
  if (address.length <= startChars + endChars) {
    return address;
  }
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
};

/**
 * Get currency display name
 * @param currency - Currency code
 * @returns Display name for the currency
 */
export const getCurrencyDisplayName = (currency: string): string => {
  switch (currency.toUpperCase()) {
    case 'USDC':
      return 'USD Coin (USDC)';
    case 'USDT':
      return 'Tether (USDT)';
    case 'SOL':
      return 'Solana (SOL)';
    default:
      return currency;
  }
};

/**
 * Generate a safe HTML attribute value by escaping special characters
 * @param value - Value to escape
 * @returns Escaped HTML attribute value
 */
export const escapeHtmlAttribute = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/**
 * Generate a safe HTML content by escaping special characters
 * @param content - Content to escape
 * @returns Escaped HTML content
 */
export const escapeHtmlContent = (content: string): string => {
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};
