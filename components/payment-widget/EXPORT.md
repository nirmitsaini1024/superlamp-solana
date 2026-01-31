# Payment Widget - Export Guide

## For Users: How to Use This Widget

The payment widget is designed to be easily integrated into any project. Here are the options:

### Option 1: Copy the Widget Files (Recommended for Quick Setup)

1. Copy the entire `payment-widget` folder to your project:
   ```
   your-project/
   └── components/
       └── payment-widget/
           ├── index.tsx
           ├── payment-widget.tsx
           ├── payment-utils.ts
           └── types.ts
   ```

2. Install required dependencies:
   ```bash
   npm install @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/web3.js @solana/spl-token
   ```

3. Add CSS to your `globals.css`:
   ```css
   @import '@solana/wallet-adapter-react-ui/styles.css';
   ```

4. Import and use:
   ```tsx
   import { PaymentWidget } from '@/components/payment-widget'
   
   <PaymentWidget
     apiKey="pk_test_..."
     apiUrl="https://sol-innerve.10xdevs.in"
     recipientAddress="YOUR_WALLET"
     products={[...]}
   />
   ```

### Option 2: Create an NPM Package (For Distribution)

1. Create a new package directory
2. Copy widget files
3. Create `package.json`:
   ```json
   {
     "name": "@okito/payment-widget",
     "version": "1.0.0",
     "main": "./index.tsx",
     "types": "./types.ts",
     "peerDependencies": {
       "@solana/wallet-adapter-base": "^0.9.23",
       "@solana/wallet-adapter-react": "^0.15.39",
       "@solana/wallet-adapter-react-ui": "^0.9.39",
       "@solana/wallet-adapter-wallets": "^0.19.32",
       "@solana/web3.js": "^1.98.4",
       "@solana/spl-token": "^0.4.8",
       "react": "^18.0.0"
     }
   }
   ```

4. Users install: `npm install @okito/payment-widget`
5. Users import: `import { PaymentWidget } from '@okito/payment-widget'`

### Option 3: Git Submodule (For Internal Use)

1. Add as submodule: `git submodule add <repo-url> components/payment-widget`
2. Import normally

## Required Dependencies

Users must install these packages:

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

## Required CSS

Add to `globals.css`:

```css
@import '@solana/wallet-adapter-react-ui/styles.css';

/* Plus the crypto-glass, crypto-base, crypto-button classes */
/* (See okito/app/globals.css for full CSS) */
```

## Files to Copy

Essential files:
- `index.tsx` - Main export
- `payment-widget.tsx` - Component
- `payment-utils.ts` - Payment logic
- `types.ts` - TypeScript types

Optional:
- `README.md` - Documentation
- `EXPORT.md` - This file


