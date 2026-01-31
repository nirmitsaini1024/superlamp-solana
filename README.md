# Payment Gateway - SuperLamp

A complete Solana payment gateway solution with beautiful UI components and easy integration.

## 🚀 Features

- **Payment Gateway API** - RESTful API for processing Solana payments
- **Payment Widget** - Beautiful, reusable payment widget (like Razorpay)
- **Dashboard** - Complete admin dashboard for managing payments
- **Webhooks** - Real-time payment notifications
- **Analytics** - Payment analytics and reporting

## 📦 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis (for rate limiting)
- Solana wallet

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Set up database:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🎨 Payment Widget

The payment widget is a self-contained component that can be easily integrated into any project.

**Location:** `components/payment-widget/`

**See:** [Payment Widget README](./components/payment-widget/README.md) for integration guide.

## 📡 API Documentation

### Create Payment Session

```bash
POST /api/v1/payments
Headers:
  X-Superlamp-KEY: pk_test_YOUR_API_KEY
  Content-Type: application/json

Body:
{
  "products": [
    {
      "id": "1",
      "name": "Product Name",
      "price": 0.5
    }
  ]
}

Response:
{
  "sessionId": "uuid",
  "error": null
}
```

## 🛠️ Development

```bash
# Development with Turbopack
npm run dev

# Development with Webpack
npm run dev:webpack

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
okito/
├── app/
│   ├── api/v1/payments/    # Payment API endpoints
│   └── ...
├── components/
│   ├── payment-widget/      # Payment widget component
│   └── ...
├── lib/                       # Utility functions
├── prisma/                    # Database schema
└── ...
```

## 🔐 Environment Variables

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string (for rate limiting)
- `NEXT_PUBLIC_SOLANA_NETWORK` - Solana network (devnet/mainnet-beta)

See `.env.example` for full list.

## 📝 License

Private - All rights reserved
