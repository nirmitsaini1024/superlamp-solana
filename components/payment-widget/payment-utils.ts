import { 
  Connection, 
  PublicKey, 
  Transaction,
  TransactionInstruction,
  SystemProgram,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'

export interface ProcessPaymentParams {
  sessionId: string
  amount: number // Amount in SOL
  recipientAddress: string
  senderPublicKey: PublicKey
  signTransaction: (transaction: Transaction) => Promise<Transaction>
  network: 'devnet' | 'mainnet-beta'
}

export async function processPaymentTransaction(params: ProcessPaymentParams) {
  const { 
    sessionId, 
    amount, 
    recipientAddress, 
    senderPublicKey,
    signTransaction,
    network,
  } = params

  const connection = new Connection(
    clusterApiUrl(network),
    'confirmed'
  )

  const recipientPublicKey = new PublicKey(recipientAddress)

  try {
    // Check if sender has enough SOL balance
    const senderBalance = await connection.getBalance(senderPublicKey)
    const amountInLamports = BigInt(Math.round(amount * LAMPORTS_PER_SOL))
    
    // Reserve some SOL for transaction fees (0.001 SOL should be enough)
    const minRequiredBalance = amountInLamports + BigInt(0.001 * LAMPORTS_PER_SOL)

    if (senderBalance < minRequiredBalance) {
      throw new Error(`Insufficient SOL balance. Required: ${amount} SOL (plus fees)`)
    }

    // Create transaction
    const transaction = new Transaction()

    // Add memo instruction with sessionId and amount
    const memoProgramId = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')
    const memoData = JSON.stringify({
      sessionId,
      amount: amount.toString(),
      currency: 'SOL',
    })
    
    const memoInstruction = new TransactionInstruction({
      keys: [{ pubkey: senderPublicKey, isSigner: true, isWritable: false }],
      programId: memoProgramId,
      data: Buffer.from(memoData, 'utf-8'),
    })
    transaction.add(memoInstruction)

    // Add SOL transfer instruction using SystemProgram
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: senderPublicKey,
      toPubkey: recipientPublicKey,
      lamports: Number(amountInLamports),
    })
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
