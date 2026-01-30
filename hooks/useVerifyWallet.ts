'use client'

import { trpc } from '@/lib/trpc'

type Params = {
  publicKey: string | null
  connected: boolean
  signMessage?: (message: Uint8Array) => Promise<Uint8Array>
  onSuccess?: () => void
  onError?: (err: any) => void
}

export function useVerifyWallet({ publicKey, connected, signMessage, onSuccess, onError }: Params) {
  const utils = trpc.useUtils()

  const verifyWallet = trpc.user.confirmWallet.useMutation({
    onSuccess,
    onError,
  })

  const getNonce = trpc.user.getWalletNonce.useMutation()

  const mutate = async () => {
    if (!connected || !publicKey) throw new Error('Please connect your wallet first')
    if (!signMessage) throw new Error('Your wallet does not support message signing.')

    try {
      // Step 1: Get nonce (direct call, not tracked as a separate mutation)
      const { message, timestamp } = await getNonce.mutateAsync({ publicKey })

      // Step 2: Sign message
      const signature = await signMessage(new TextEncoder().encode(message))

      // Step 3: Confirm wallet
      await verifyWallet.mutateAsync({
        publicKey,
        signature: Array.from(signature),
        timestamp,
      })
    } catch (err) {
      onError?.(err)
    }
  }

  return {
    mutate,
    isLoading: getNonce.isPending || verifyWallet.isPending,
    error: getNonce.error || verifyWallet.error,
    isSuccess: verifyWallet.isSuccess,
  }
}
