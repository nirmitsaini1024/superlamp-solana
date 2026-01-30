import bs58 from "bs58";
import type { Instruction,MemoData } from "./types";


const MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";

// Helper function to determine network based on token environment
// Force devnet for all environments
export function getNetworkFromTokenEnvironment(tokenEnvironment?: string): string {
    // Always return devnet regardless of environment
    return 'devnet';
  }

  



export function parseMemoDataIntoString(instructions: Instruction[]): MemoData | null {
    const memoInstruction = instructions.find((ix) => ix.programId === MEMO_PROGRAM_ID);
  
    if (!memoInstruction) return null;
  
    try {
      let decodedData: string;
      
      // Try base58 first (most common for Solana webhook data)
      try {
        const decodedBytes = bs58.decode(memoInstruction.data);
        decodedData = Buffer.from(decodedBytes).toString('utf-8');
        console.log('Successfully decoded with base58:', decodedData);
      } catch (base58Error) {
        console.log('Base58 decode failed, trying base64:', memoInstruction.data);
        
        // Fallback to base64
        try {
          decodedData = Buffer.from(memoInstruction.data, 'base64').toString('utf-8');
          console.log('Successfully decoded with base64:', decodedData);
        } catch (base64Error) {
          console.error('Both base58 and base64 decode failed:', { base58Error, base64Error });
          return null;
        }
      }
      
      return JSON.parse(decodedData) as MemoData;
    } catch (error) {
      console.error('Failed to parse memo data:', error);
      return null;
    }
  }
  