import cron from "node-cron";
import SchedulerLog from "../models/SchedulerLog.js";

const CRON_EXPRESSION =
    process.env.CLEANUP_SCHEDULER_CRON || "0 2 * * *";

const LOG_RETENTION_DAYS = Number(
    process.env.LOG_RETENTION_DAYS || 30
);

const cleanupSchedulerLogs = async () => {
    const startedAt = new Date();
    try {
        console.log("[Cleanup Scheduler] Started");
        const expiryDate = new Date();
        expiryDate.setDate(
            expiryDate.getDate() - LOG_RETENTION_DAYS
        );
        const result = await SchedulerLog.deleteMany({
            createdAt: {
                $lt: expiryDate
            }
        });
        const endedAt = new Date();
        console.log(
            `[Cleanup Scheduler] Removed ${result.deletedCount} old logs in ${endedAt.getTime() - startedAt.getTime()
            } ms`
        );

    } catch (error) {
        console.error(
            "[Cleanup Scheduler]",
            error.message
        );
    }
};
export const startCleanupScheduler = () => {
    console.log(
        `Cleanup Scheduler Running (${CRON_EXPRESSION})`
    );
    cron.schedule(
        CRON_EXPRESSION,
        async () => {

            await cleanupSchedulerLogs();
        },
        {

            timezone: "Asia/Kolkata"
        }
    );
};

export default startCleanupScheduler;