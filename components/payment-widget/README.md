# Payment Widget - Easy Integration Guide

A beautiful, self-contained Solana payment widget that you can easily integrate into any project - just like Razorpay!

## 🚀 Quick Start

### Step 1: Copy the Widget

Copy the entire `payment-widget` folder to your project:

```
your-project/
└── components/
    └── payment-widget/
        ├── index.tsx
        ├── payment-widget.tsx
        ├── payment-utils.ts
        └── types.ts
```

### Step 2: Install Dependencies

```bash
npm install \
  @solana/wallet-adapter-base \
  @solana/wallet-adapter-react \
  @solana/wallet-adapter-react-ui \
  @solana/wallet-adapter-wallets \
  @solana/web3.js \
  @solana/spl-token \
  @hugeicons/react \
  @hugeicons/core-free-icons \
  sonner
```

### Step 3: Add CSS

Add to your `globals.css`:

```css
@import '@solana/wallet-adapter-react-ui/styles.css';

/* Crypto glassmorphism styles */
.crypto-glass {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(128px);
  -webkit-backdrop-filter: blur(128px);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 0.5rem;
  box-shadow: 
    0 8px 16px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(255, 255, 255, 0.4);
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.crypto-glass-static {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 0.5rem;
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(255, 255, 255, 0.4);
}

.crypto-base {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 0.5rem;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.crypto-button {
  position: relative;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0.75rem;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.10);
  box-shadow: 
    0 2px 6px rgba(0, 0, 0, 0.10),
    inset 0 1px 1px rgba(255, 255, 255, 0.85);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  .crypto-glass {
    background: rgba(15, 15, 15, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  
  .crypto-glass-static {
    background: rgba(15, 15, 15, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  
  .crypto-base {
    background: rgba(15, 15, 15, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  
  .crypto-button {
    background: rgba(255, 255, 255, 0.06);
  }
}
```

### Step 4: Use It!

```tsx
import { PaymentWidget } from '@/components/payment-widget'

export default function CheckoutPage() {
  return (
    <PaymentWidget
      apiKey="pk_test_YOUR_API_KEY"
      apiUrl="https://sol-innerve.10xdevs.in"
      recipientAddress="YOUR_WALLET_ADDRESS"
      products={[
        {
          id: '1',
          name: 'Pro Plan',
          description: 'Advanced features',
          price: 0.5,
        },
        {
          id: '2',
          name: 'Premium Support',
          description: 'Priority support',
          price: 0.2,
        },
      ]}
      network="devnet"
      onSuccess={(data) => {
        console.log('Payment successful!', data)
        // Redirect or show success message
      }}
      onError={(error) => {
        console.error('Payment failed:', error)
      }}
    />
  )
}
```

## 📋 Configuration

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `apiKey` | `string` | Your payment gateway API key (starts with `pk_test_` or `pk_live_`) |
| `apiUrl` | `string` | Payment gateway API URL (e.g., `https://sol-innerve.10xdevs.in`) |
| `recipientAddress` | `string` | Merchant wallet address that receives payments |
| `products` | `Product[]` | Array of products to purchase |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `network` | `'devnet' \| 'mainnet-beta'` | `'devnet'` | Solana network |
| `onSuccess` | `function` | - | Callback when payment succeeds |
| `onError` | `function` | - | Callback when payment fails |

### Product Interface

```typescript
interface Product {
  id: string
  name: string
  price: number
  description?: string
  metadata?: Record<string, unknown>
}
```

## 🎨 Features

- ✅ **Self-contained** - Includes wallet provider, no extra setup needed
- ✅ **Beautiful UI** - Polished animations and glassmorphism design
- ✅ **Easy Integration** - Just import and use
- ✅ **TypeScript Support** - Full type safety
- ✅ **Responsive** - Works on all screen sizes
- ✅ **Dark Mode** - Automatic dark mode support

## 📝 Example: Complete Integration

```tsx
// app/checkout/page.tsx
'use client'

import { PaymentWidget } from '@/components/payment-widget'

export default function CheckoutPage() {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY!
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!
  const recipientAddress = process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS!

  return (
    <PaymentWidget
      apiKey={apiKey}
      apiUrl={apiUrl}
      recipientAddress={recipientAddress}
      products={[
        {
          id: '1',
          name: 'Premium Subscription',
          description: 'Monthly premium access',
          price: 10.0,
        },
      ]}
      network="devnet"
      onSuccess={(data) => {
        // Redirect to success page
        window.location.href = `/success?tx=${data.txSignature}`
      }}
      onError={(error) => {
        alert(`Payment failed: ${error.message}`)
      }}
    />
  )
}
```

## 🔧 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_KEY=pk_test_YOUR_KEY
NEXT_PUBLIC_API_URL=https://sol-innerve.10xdevs.in
NEXT_PUBLIC_RECIPIENT_ADDRESS=YOUR_WALLET_ADDRESS
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

## 🎯 What Users See

1. **Order Summary** - Products, subtotal, network fee, total
2. **Payment Method** - Currency selection (USDC/USDT) and wallet connection
3. **Processing Animation** - Beautiful animated UI while transaction processes
4. **Success Screen** - Animated checkmark with transaction details

## 🐛 Troubleshooting

**Error: "Cannot find module '@solana/wallet-adapter-wallets'"**
- Run `npm install` to install dependencies

**Error: "Wallet not connecting"**
- Make sure you have Phantom or Solflare wallet installed
- Check browser console for errors

**Error: "CORS error"**
- Make sure CORS is enabled on your API server
- Check that `apiUrl` is correct

## 📚 Need Help?

Check the main project documentation or contact support.

---

**That's it!** Just copy, install, and use. No complex setup required! 🎉
