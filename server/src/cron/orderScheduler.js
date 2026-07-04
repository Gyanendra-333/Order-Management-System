import cron from "node-cron";
import Order from "../models/Order.js";
import SchedulerLog from "../models/SchedulerLog.js";
import { validateStatusTransition } from "../utils/orderWorkflow.js";
import { createAudit } from "../services/orderAudit.service.js";

const CRON_EXPRESSION = process.env.ORDER_SCHEDULER_CRON || "*/5 * * * *";

const processOrders = async () => {
    const startedAt = new Date();
    let ordersChecked = 0;
    let ordersUpdated = 0;
    const errors = [];

    try {
        console.log("[Scheduler] Order Scheduler Started");
        const orders = await Order.find({
            status: "PLACED"
        });
        ordersChecked = orders.length;
        for (const order of orders) {
            try {
                validateStatusTransition(
                    order.status,
                    "PROCESSING"
                );
                order.status = "PROCESSING";
                order.statusHistory.push({
                    status: "PROCESSING",
                    changedBy: "SYSTEM",
                    changedAt: new Date()
                });
                await order.save();
                await createAudit({
                    order: order._id,
                    action: "STATUS_UPDATED",
                    previousStatus: "PLACED",
                    currentStatus: "PROCESSING",
                    performedBy: "SYSTEM"
                });
                ordersUpdated++;
            } catch (error) {
                console.error(error);
                errors.push(
                    `Order ${order.orderId} : ${error.message}`
                );
            }
        }
    } catch (error) {
        console.error(error);
        errors.push(error.message);
    }
    const endedAt = new Date();
    const executionTime =
        endedAt.getTime() - startedAt.getTime();
    await SchedulerLog.create({
        startedAt,
        endedAt,
        ordersChecked,
        ordersUpdated,
        executionTime,
        success: errors.length === 0,
        errors
    });
    console.log(
        `[Scheduler] Completed | Checked: ${ordersChecked} | Updated: ${ordersUpdated}`
    );
};

export const startOrderScheduler = () => {
    console.log(
        `Order Scheduler Running (${CRON_EXPRESSION})`
    );
    cron.schedule(
        CRON_EXPRESSION,
        async () => {
            await processOrders();
        },
        {
            timezone: "Asia/Kolkata"
        }
    );
};
export default startOrderScheduler;