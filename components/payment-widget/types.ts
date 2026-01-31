export interface Product {
  id: string
  name: string
  price: number
  description?: string
  metadata?: Record<string, unknown>
}

export interface PaymentWidgetConfig {
  apiKey: string
  apiUrl: string
  recipientAddress: string
  products: Product[]
  network?: 'devnet' | 'mainnet-beta'
  onSuccess?: (data: { sessionId: string; txSignature: string }) => void
  onError?: (error: Error) => void
  theme?: 'light' | 'dark' | 'auto'
}

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'error'


