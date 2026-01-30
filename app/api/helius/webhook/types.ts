
export interface MemoData {
    sessionId: string;
    amount: string;
    token: string;
    timestamp: number;
    projectId: string;
}

// Helius webhook types
export interface TokenBalanceChange {
    mint: string;
    rawTokenAmount: {
        decimals: number;
        tokenAmount: string;
    };
    tokenAccount: string;
    userAccount: string;
}

export interface AccountData {
    account: string;
    nativeBalanceChange: number;
    tokenBalanceChanges: TokenBalanceChange[];
}

export interface TokenTransfer {
    fromTokenAccount: string;
    fromUserAccount: string;
    mint: string;
    toTokenAccount: string;
    toUserAccount: string;
    tokenAmount: number;
    tokenStandard: string;
}

export interface InnerInstruction {
    accounts: string[];
    data: string;
    programId: string;
}

export interface Instruction {
    accounts: string[];
    data: string;
    innerInstructions: InnerInstruction[];
    programId: string;
}

export interface NativeTransfer {
    fromUserAccount: string;
    toUserAccount: string;
    amount: number;
}

export interface TransactionError {
    error: string;
    instruction: number;
    logs: string[];
}

export interface HeliusWebhookTransaction {
    accountData: AccountData[];
    description: string;
    events: Record<string, unknown>;
    fee: number;
    feePayer: string;
    instructions: Instruction[];
    nativeTransfers: NativeTransfer[];
    signature: string;
    slot: number;
    source: string;
    timestamp: number;
    tokenTransfers: TokenTransfer[];
    transactionError: TransactionError | null;
    type: string;
}

export type HeliusWebhookData = HeliusWebhookTransaction[];
