"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle01Icon,
  Wallet01Icon,
  ArrowUpRightIcon,
  ZapIcon,
} from "@hugeicons/core-free-icons"
import CustomWallet from "../ui/custom-wallet"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { toast } from "sonner"
import { PaymentWidgetConfig, Product, PaymentStatus } from "./types"
import { processPaymentTransaction } from "./payment-utils"

export function PaymentWidget({ 
  apiKey, 
  apiUrl, 
  recipientAddress, 
  products, 
  network = 'devnet',
  onSuccess,
  onError,
}: PaymentWidgetConfig) {
  const { publicKey, connected, signTransaction } = useWallet()
  const { connection } = useConnection()
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [txSignature, setTxSignature] = useState<string | null>(null)

  const subtotal = products.reduce((sum, item) => sum + item.price, 0)
  const networkFee = 0.001
  const totalAmount = subtotal + networkFee

  const formatAmount = (amount: number) => `${amount.toFixed(3)} SOLANA`

  const handlePayment = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!signTransaction) {
      toast.error('Wallet sign function not available')
      return
    }

    setPaymentStatus("processing")

    try {
      // Create payment session
      const cleanApiUrl = apiUrl.replace(/\/$/, '')
      const paymentUrl = `${cleanApiUrl}/api/v1/payments`

      const response = await fetch(paymentUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'X-Superlamp-KEY': apiKey,
        },
        body: JSON.stringify({
          products: products.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            metadata: p.metadata,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create payment session' }))
        throw new Error(errorData.error || `API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error || !data.sessionId) {
        throw new Error(data.error || 'No session ID returned')
      }

      setSessionId(data.sessionId)

      // Process payment transaction
      const result = await processPaymentTransaction({
        sessionId: data.sessionId,
        amount: totalAmount,
        recipientAddress,
        senderPublicKey: publicKey,
        signTransaction,
        network,
      })

      setTxSignature(result.signature)
      setPaymentStatus("success")
      
      toast.success('Payment successful!')
      
      if (onSuccess) {
        onSuccess({
          sessionId: data.sessionId,
          txSignature: result.signature,
        })
      }
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentStatus("error")
      const errorMessage = error instanceof Error ? error.message : 'Payment failed'
      toast.error(errorMessage)
      
      if (onError) {
        onError(error instanceof Error ? error : new Error(errorMessage))
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <main className="min-h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="grid lg:grid-cols-5 gap-16 items-center">
            {/* Order Summary - Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-8">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                    Billing Details
                  </h3>
                  <p className="text-sm text-muted-foreground">Review your order summary</p>
                </div>
                
                <div className="space-y-8">
                  <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

                  {products.map((item, index) => (
                    <div key={item.id} className="group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground/80 mt-1 leading-relaxed">
                              {item.description}
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-6">
                          <div className="text-base font-bold text-foreground">
                            {formatAmount(item.price)}
                          </div>
                        </div>
                      </div>
                      {index < products.length - 1 && (
                        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent"></div>
                      )}
                    </div>
                  ))}

                  <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

                  {/* Subtotal */}
                  <div className="group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                          Subtotal
                        </div>
                        <div className="text-xs text-muted-foreground/80 mt-1 leading-relaxed">
                          Sum of all selected items
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <div className="text-base font-bold text-foreground">
                          {formatAmount(subtotal)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Network Fee */}
                  <div className="group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                          Network Fee
                        </div>
                        <div className="text-xs text-muted-foreground/80 mt-1 leading-relaxed">
                          Blockchain transaction fee
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <div className="text-base font-bold text-foreground">
                          {formatAmount(networkFee)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vertical Gradient Separator */}
            <div className="hidden lg:flex justify-center items-center h-full min-h-[600px] relative">
              <div className="w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-primary/40 animate-pulse"></div>
              </div>
            </div>

            {/* Payment Interface - Right Column */}
            <div className="lg:col-span-2 space-y-8">
              {paymentStatus === "idle" && (
                <div className="space-y-8">
                  <div className="text-center lg:text-left">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                      Payment Method
                    </h2>
                    <p className="text-muted-foreground">Connect your wallet to pay with SOLANA</p>
                  </div>

                  {/* Payment Setup */}
                  <div className="crypto-base p-6 rounded-2xl">
                    <div className="space-y-4">
                      <div className="text-sm font-medium text-foreground">Payment Setup</div>
                      
                      <div className="flex items-center justify-center">
                        {/* Wallet Connection */}
                        <CustomWallet />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Action */}
              <div className="crypto-base p-6 rounded-2xl">
                <div className="space-y-4">
                  <div className="text-sm font-medium text-foreground">Complete Payment</div>
                  
                  {paymentStatus === "idle" && (
                    <div className="space-y-4">
                      {/* Main Payment Button */}
                      <div className="relative">
                        <button
                          onClick={handlePayment}
                          disabled={!connected}
                          className={`group relative w-full h-16 rounded-2xl font-bold transition-all duration-300 ${
                            connected
                              ? "crypto-glass-static hover:opacity-50"
                              : "crypto-button cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-4 px-6">
                            {connected ? (
                              <>
                                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                                  <HugeiconsIcon icon={Wallet01Icon} className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex flex-col items-start">
                                  <span className="text-lg font-bold text-foreground">Pay {formatAmount(totalAmount)}</span>
                                  <span className="text-xs text-muted-foreground font-normal">Complete your purchase</span>
                                </div>
                                <div className="ml-auto">
                                  <HugeiconsIcon icon={ArrowUpRightIcon} className="h-5 w-5 text-primary" />
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="p-2 rounded-xl bg-muted-foreground/20">
                                  <HugeiconsIcon icon={Wallet01Icon} className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col items-start">
                                  <span className="text-lg font-bold">Connect Wallet to Continue</span>
                                  <span className="text-xs text-muted-foreground font-normal">Required to process payment</span>
                                </div>
                              </>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {paymentStatus === "processing" && (
                    <div className="space-y-6">
                      {/* Processing Animation */}
                      <div className="flex flex-col items-center space-y-4 py-6">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full border-4 border-primary/30 animate-spin"></div>
                              <div className="absolute top-1 left-1 w-10 h-10 rounded-full border-4 border-transparent border-t-primary animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <HugeiconsIcon icon={ZapIcon} className="h-5 w-5 text-primary animate-pulse" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-center space-y-2">
                          <h3 className="text-lg font-bold text-foreground">Processing Transaction</h3>
                          <p className="text-sm text-muted-foreground">Confirm the transaction in your wallet</p>
                        </div>

                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentStatus === "success" && (
                    <div className="space-y-8">
                      {/* Success Animation Container */}
                      <div className="relative flex flex-col items-center space-y-8 py-8">
                        {/* Animated success icon */}
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center">
                            <div className="relative">
                              {/* Success ring animation */}
                              <div className="w-20 h-20 rounded-full border-4 border-green-500/30 animate-pulse"></div>
                              {/* Checkmark with scale animation */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <HugeiconsIcon 
                                  icon={CheckmarkCircle01Icon} 
                                  className="h-12 w-12 text-green-500" 
                                  style={{animationDuration: '2s'}}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Success message */}
                        <div className="text-center space-y-3">
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                            Payment Successful!
                          </h3>
                          <p className="text-muted-foreground max-w-md leading-relaxed">
                            Your transaction has been confirmed on the blockchain and your payment has been processed securely.
                          </p>
                        </div>

                        {/* Transaction details */}
                        {txSignature && (
                          <div className="w-full max-w-md space-y-4">
                            <div className="flex items-center justify-between py-3">
                              <span className="text-sm font-medium text-muted-foreground">Transaction ID</span>
                              <div className="flex items-center gap-2">
                                <HugeiconsIcon icon={ArrowUpRightIcon} className="h-4 w-4 text-primary" />
                                <span className="text-sm font-mono text-foreground break-all">
                                  {txSignature.slice(0, 8)}...{txSignature.slice(-8)}
                                </span>
                              </div>
                            </div>
                            {sessionId && (
                              <div className="flex items-center justify-between py-3">
                                <span className="text-sm font-medium text-muted-foreground">Session ID</span>
                                <span className="text-sm font-mono text-foreground break-all">
                                  {sessionId.slice(0, 8)}...{sessionId.slice(-8)}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {paymentStatus === "error" && (
                    <div className="space-y-4 py-6">
                      <div className="text-center">
                        <p className="text-red-600 dark:text-red-400">Payment failed. Please try again.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


