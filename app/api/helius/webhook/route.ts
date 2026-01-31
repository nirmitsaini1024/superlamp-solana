import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { deliverWebhookToAllEndpoints, WebhookEventPayload } from "@/app/api/helius/webhook/webhook-delivery";
import { emailService } from "@/lib/email-service";
import { EmailTemplateType } from "@/lib/email-templates";
import { getNetworkFromTokenEnvironment, parseMemoDataIntoString } from "./helpers";
import { getMintAddress } from "@/app/api/v1/payments/helpers";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader) {
    return NextResponse.json(
      {
        msg: "Unauthorized",
      },
      {
        status: 403,
      }
    );
  }

  if (authHeader !== process.env.AUTH_HEADER) {
    return NextResponse.json(
      {
        msg: "Invalid auth header found",
      },
      {
        status: 403,
      }
    );
  }

  const webhookData = await req.json();

  for (const transaction of webhookData) {
    try {
      if (transaction.transactionError) {
        continue;
      }

      // Check for both token transfers (SPL tokens) and native transfers (SOL)
      const hasTokenTransfers = transaction.tokenTransfers && transaction.tokenTransfers.length > 0;
      const hasNativeTransfers = transaction.nativeTransfers && transaction.nativeTransfers.length > 0;
      
      // Skip if no transfers at all (not a payment)
      if (!hasTokenTransfers && !hasNativeTransfers) {
        continue;
      }

      // Parse memo data to get session information
      const memoData = parseMemoDataIntoString(transaction.instructions);

      if (!memoData || !memoData.sessionId) {
        continue;
      }

      // Idempotency check: Skip if this transaction has already been processed
      const existingPayment = await prisma.payment.findFirst({
        where: { txHash: transaction.signature },
      });

      if (existingPayment) {
        continue;
      }

      // Find the event by session ID
      const event = await prisma.event.findFirst({
        where: { sessionId: memoData.sessionId },
        include: {
          payment: {
            include: {
              products: true,
              token: true,
            },
          },
          project: true,
          token: true,
        },
      });

      if (!event) {
        continue;
      }

      // Verify the payment amount matches - handle both SOL and token transfers
      const expectedAmount = parseFloat(memoData.amount);
      let actualAmount: number;
      const isSOLPayment = hasNativeTransfers && !hasTokenTransfers;
      
      if (hasTokenTransfers) {
        // For SPL token transfers (USDC/USDT)
        actualAmount = transaction.tokenTransfers[0]?.tokenAmount || 0;
      } else if (hasNativeTransfers) {
        // For native SOL transfers - convert lamports to SOL
        actualAmount = (transaction.nativeTransfers[0]?.amount || 0) / 1_000_000_000;
      } else {
        continue;
      }

      if (Math.abs(expectedAmount - actualAmount) > 0.000001) {
        // Allow for small floating point differences
        continue;
      }

      // Detect currency symbol from related token info, fallback to existing currency
      // For SOL payments, currency will remain null
      // Try to infer currency from transfer mint and project token environment
      const transfer = transaction.tokenTransfers?.[0]
      const transferMint: string | undefined = transfer?.mint
      const envForNetwork = event.payment?.token?.environment || event.token?.environment
      const network = getNetworkFromTokenEnvironment(envForNetwork)
      type SolanaNetwork = 'mainnet-beta' | 'devnet'
      const networkForHelper: SolanaNetwork = 'devnet' // Force devnet for all transactions
      let resolvedCurrency: 'USDC' | 'USDT' | null = null
      try {
        // Only detect currency for token transfers, not SOL payments
        if (transferMint && hasTokenTransfers) {
          const usdcMint = getMintAddress('USDC', networkForHelper).toBase58()
          const usdtMint = getMintAddress('USDT', networkForHelper).toBase58()
          if (transferMint === usdcMint) resolvedCurrency = 'USDC'
          else if (transferMint === usdtMint) resolvedCurrency = 'USDT'
        }
      } catch {}

      // Update the payment status to confirmed (and persist currency if detected)
      await prisma.payment.update({
        where: { id: event.payment!.id },
        data: {
          status: "CONFIRMED",
          txHash: transaction.signature,
          blockNumber: BigInt(transaction.slot),
          confirmedAt: new Date(transaction.timestamp * 1000), // Convert Unix timestamp to Date
          updatedAt: new Date(),
          ...(resolvedCurrency ? { currency: resolvedCurrency } : {}),
        },
      });

      // Build context from existing event/payment after payment update (no event mutation)
      const context = await prisma.event.findFirst({
        where: { id: event.id },
        include: {
          payment: {
            include: {
              products: true,
              token: true,
            },
          },
          project: true,
          token: true,
        },
      });

      if (!context || !context.payment) {
        return NextResponse.json(
          {
            msg: "Payment not found",
          },
          {
            status: 500,
          }
        );
      }

      // Determine network from token environment
      const tokenEnvironment =
        context.payment!.token?.environment || context.token?.environment;
      const networkContext = getNetworkFromTokenEnvironment(tokenEnvironment);

      // Determine amount conversion divisor based on payment type
      // SOL payments: stored in lamports (1 SOL = 1,000,000,000 lamports)
      // Token payments: stored in micro units (1 token = 1,000,000 micro units)
      const amountDivisor = isSOLPayment ? 1_000_000_000 : 1_000_000;

      // Create webhook payload
      const webhookPayload: WebhookEventPayload = {
        id: context.id,
        type: "PAYMENT",
        createdAt: context.createdAt.toISOString(),
        data: {
          sessionId: context.sessionId,
          paymentId: context.payment.id,
          amount: Number(context.payment.amount) / amountDivisor, // Convert based on payment type
          currency: context.payment.currency ?? (isSOLPayment ? undefined : "USDC"),
          network: networkContext,
          status: "CONFIRMED",
          metadata: event.metadata ?? {},
          walletAddress: context.payment.recipientAddress,
          tokenMint: memoData.token,
          transactionSignature: transaction.signature,
          blockNumber: transaction.slot,
          confirmedAt: new Date(transaction.timestamp * 1000).toISOString(),
          products:
            context.payment.products?.map((product) => ({
              id: product.id,
              name: product.name,
              price: Number(product.price) / amountDivisor, // Convert based on payment type
              metadata: product.metadata,
            })) || [],
        },
      };

      // Deliver webhooks to all configured endpoints
      try {
        const webhookResult = await deliverWebhookToAllEndpoints(
          context.id,
          context.projectId,
          "PAYMENT",
          webhookPayload
        );

        // Send email notifications for failed webhook endpoints
        if (webhookResult.failedEndpoints.length > 0) {
          console.log(`Webhook delivery failed for ${webhookResult.failedEndpoints.length} endpoints`);
          
          for (const failedEndpoint of webhookResult.failedEndpoints) {
            try {
              await emailService.sendNotification({
                projectId: context.projectId,
                templateType: EmailTemplateType.WEBHOOK_FAILURE,
                templateProps: {
                  projectName: context.project.name,
                  webhookUrl: failedEndpoint.endpoint.url,
                  errorMessage: failedEndpoint.errorMessage,
                  eventType: "PAYMENT",
                  eventId: context.id,
                  failedAt: new Date().toISOString(),
                  retryAttempts: failedEndpoint.attempts,
                },
              });
            } catch (emailError) {
              console.error('Failed to send webhook failure email:', emailError);
            }
          }
        }
      } catch (webhookError) {
        // Don't fail the main transaction processing if webhook delivery fails
        console.error('Webhook delivery failed:', webhookError);
      }

      // Send email notification
      try {
        await emailService.sendNotification({
          projectId: context.projectId,
          templateType: EmailTemplateType.SALE_NOTIFICATION,
          templateProps: {
            projectName: context.project.name,
            customerWalletAddress: context.payment.recipientAddress,
            amount: Number(context.payment.amount) / amountDivisor, // Convert based on payment type
            currency: context.payment.currency ?? (isSOLPayment ? "SOL" : "USDC"),
            transactionSignature: transaction.signature,
            products:
              context.payment.products?.map((product) => ({
                name: product.name,
                price: Number(product.price) / amountDivisor, // Convert based on payment type
                quantity: 1, // You might want to add quantity to your product schema
              })) || [],
            network: network,
            confirmedAt: new Date(transaction.timestamp * 1000).toISOString(),
          },
        });
      } catch (_emailError) {
        // Don't fail the main transaction processing if email sending fails
        console.error('Email notification failed:', _emailError);
      }
    } catch (_error) {
      // Continue processing other transactions even if one fails
      console.error('Transaction processing failed:', _error);
    }
  }

  return NextResponse.json(
    {
      msg: "OK",
    },
    {
      status: 200,
    }
  );
}