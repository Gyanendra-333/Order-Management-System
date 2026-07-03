import * as orderService from "../services/order.service.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const order = await orderService.updateOrder(id, {
        status
    });

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    res.status(200).json({
        success: true,
        message: "Order status updated successfully.",
        data: order
    });
});