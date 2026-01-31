"use client"

/**
 * Standalone Payment Widget
 * 
 * This is a self-contained payment widget that can be easily copied and used in any project.
 * Just copy this file and its dependencies to your project.
 * 
 * Usage:
 * ```tsx
 * import { PaymentWidget } from './payment-widget-standalone'
 * 
 * <PaymentWidget
 *   apiKey="pk_test_..."
 *   apiUrl="https://sol-innerve.10xdevs.in"
 *   recipientAddress="YOUR_WALLET"
 *   products={[...]}
 * />
 * ```
 */

import { useMemo } from "react"
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"
import { PaymentWidget as PaymentWidgetComponent } from "./payment-widget"
import { PaymentWidgetConfig } from "./types"

// Import wallet adapter CSS - users need to add this to their globals.css
// @import '@solana/wallet-adapter-react-ui/styles.css';

export function PaymentWidget(config: PaymentWidgetConfig) {
  const network = (config.network || 'devnet') as WalletAdapterNetwork
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <PaymentWidgetComponent {...config} />
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}

export type { PaymentWidgetConfig, Product } from "./types"

