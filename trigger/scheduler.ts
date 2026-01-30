import { logger, schedules } from "@trigger.dev/sdk";
import prisma from "@/db/index";

export const timeoutEventsTask = schedules.task({
  id: "timeout-events-task",
  // Once a day at midnight UTC
  cron: "0 0 * * *",
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload, { ctx }) => {
    logger.log("Starting timeout events task", { 
      timestamp: payload.timestamp,
      timezone: payload.timezone 
    });

    try {
      // Calculate the timeout threshold (15 minutes + 20 seconds buffer ago)
      const timeoutThreshold = new Date(Date.now() - (15 * 60 * 1000 + 20 * 1000));
      
      logger.log("Looking for events older than", { timeoutThreshold });

      // Update payments directly based on their related events' age
      const updateResult = await prisma.payment.updateMany({
        where: {
          status: "PENDING",
          events: {
            some: {
              createdAt: {
                lt: timeoutThreshold
              }
            }
          }
        },
        data: {
          status: "TIMED_OUT",
          failureReason: "Session timeout - payment not completed within 15 minutes"
        }
      });

      logger.log(`Successfully updated ${updateResult.count} payments to TIMED_OUT status due to timeout`);

      logger.log("Timeout events task completed successfully");
      
    } catch (error) {
      logger.error("Error in timeout events task", { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  },
});