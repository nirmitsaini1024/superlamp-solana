import { toast } from "sonner"
import { trpc } from "@/lib/trpc"

export const useWebhookTest = () => {
  return trpc.webhook.test.useMutation({
    onSuccess: () => {
      toast.success("Test webhook sent successfully")
    },

    onError: (error) => {
      toast.error(error.message || "Failed to test webhook. Please try again.")
    }
  })
}
