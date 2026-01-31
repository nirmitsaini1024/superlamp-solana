import { 
  Connection, 
  PublicKey, 
  Transaction,
  TransactionInstruction,
  clusterApiUrl,
} from '@solana/web3.js'
import { 
  getAssociatedTokenAddress,
  createTransferInstruction,
  getAccount,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'

// Token mint addresses
const TOKEN_MINTS = {
  USDC: {
    devnet: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    'mainnet-beta': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  },
  USDT: {
    devnet: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    'mainnet-beta': 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  },
}

export interface ProcessPaymentParams {
  sessionId: string
  amount: number
  currency: 'USDC' | 'USDT'
  recipientAddress: string
  senderPublicKey: PublicKey
  signTransaction: (transaction: Transaction) => Promise<Transaction>
  network: 'devnet' | 'mainnet-beta'
}

export async function processPaymentTransaction(params: ProcessPaymentParams) {
  const { 
    sessionId, 
    amount, 
    currency, 
    recipientAddress, 
    senderPublicKey,
    signTransaction,
    network,
  } = params

  // Get token mint address
  const mintAddress = TOKEN_MINTS[currency][network]
  if (!mintAddress) {
    throw new Error(`Token mint not found for ${currency} on ${network}`)
  }

  const connection = new Connection(
    clusterApiUrl(network),
    'confirmed'
  )

  const mintPublicKey = new PublicKey(mintAddress)
  const recipientPublicKey = new PublicKey(recipientAddress)

  try {
    // Get associated token accounts
    const senderTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      senderPublicKey,
      false,
      TOKEN_PROGRAM_ID
    )

    const recipientTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      recipientPublicKey,
      false,
      TOKEN_PROGRAM_ID
    )

    // Check if sender has enough balance
    let senderAccount
    try {
      senderAccount = await getAccount(connection, senderTokenAccount)
    } catch (error) {
      throw new Error(`No ${currency} token account found. Please ensure you have ${currency} tokens.`)
    }

    // Convert amount to token decimals (6 for USDC/USDT)
    const amountInSmallestUnit = BigInt(Math.round(amount * 1_000_000))

    if (senderAccount.amount < amountInSmallestUnit) {
      throw new Error(`Insufficient ${currency} balance. Required: ${amount} ${currency}`)
    }

    // Create transaction
    const transaction = new Transaction()

    // Add memo instruction with sessionId and amount
    const memoProgramId = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')
    const memoData = JSON.stringify({
      sessionId,
      amount: amount.toString(),
      currency,
    })
    
    const memoInstruction = new TransactionInstruction({
      keys: [{ pubkey: senderPublicKey, isSigner: true, isWritable: false }],
      programId: memoProgramId,
      data: Buffer.from(memoData, 'utf-8'),
    })
    transaction.add(memoInstruction)

    // Add token transfer instruction
    const transferInstruction = createTransferInstruction(
      senderTokenAccount,
      recipientTokenAccount,
      senderPublicKey,
      amountInSmallestUnit,
      [],
      TOKEN_PROGRAM_ID
    )
    transaction.add(transferInstruction)

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized')
    transaction.recentBlockhash = blockhash
    transaction.feePayer = senderPublicKey

    // Sign and send transaction
    const signedTransaction = await signTransaction(transaction)
    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
      skipPreflight: false,
    })

    // Wait for confirmation
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    }, 'confirmed')

    return {
      success: true,
      signature,
      message: 'Payment transaction confirmed',
    }
  } catch (error) {
    console.error('Payment processing error:', error)
    throw error
  }
}


