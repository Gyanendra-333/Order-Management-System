import OrderAudit from "../models/OrderAudit.js";

export const createAudit = async ({
    order,
    action,
    previousStatus = null,
    currentStatus = null,
    performedBy = "SYSTEM",
    reason = "",
    metadata = {}
}) => {

    return await OrderAudit.create({

        order,
        action,
        previousStatus,
        currentStatus,
        performedBy,
        reason,
        metadata
    });

};

export const getOrderTimeline = async (orderId) => {

    return await OrderAudit.find({
        order: orderId
    })
        .sort({
            createdAt: 1
        });

};

export const deleteOrderLogs = async (orderId) => {

    return await OrderAudit.deleteMany({
        order: orderId
    });

};