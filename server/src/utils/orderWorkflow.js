import { ORDER_STATUS } from "../models/Order.js";
import ApiError from "./ApiError.js";

const workflow = {
    [ORDER_STATUS.PLACED]: [
        ORDER_STATUS.PROCESSING,
        ORDER_STATUS.CANCELLED
    ],

    [ORDER_STATUS.PROCESSING]: [
        ORDER_STATUS.READY_TO_SHIP,
        ORDER_STATUS.CANCELLED
    ],

    [ORDER_STATUS.READY_TO_SHIP]: [
        ORDER_STATUS.SHIPPED
    ],

    [ORDER_STATUS.SHIPPED]: [
        ORDER_STATUS.DELIVERED
    ],

    [ORDER_STATUS.DELIVERED]: [],
    [ORDER_STATUS.CANCELLED]: []
};

export const isValidStatusTransition = (
    currentStatus,
    nextStatus
) => {

    if (currentStatus === nextStatus) {
        return true;
    }

    const allowedTransitions =
        workflow[currentStatus] || [];

    return allowedTransitions.includes(nextStatus);
};

export const validateStatusTransition = (
    currentStatus,
    nextStatus
) => {

    const valid = isValidStatusTransition(
        currentStatus,
        nextStatus
    );

    if (!valid) {
        throw new ApiError(
            400,
            `Invalid status transition from ${currentStatus} to ${nextStatus}`
        );
    }

    return true;
};

export default workflow;