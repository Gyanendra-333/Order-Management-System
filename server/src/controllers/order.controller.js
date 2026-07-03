import { StatusCodes } from "http-status-codes";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import orderService from "../services/order.service.js";

export const createOrder = asyncHandler(
    async (req, res) => {
        const order = await orderService.createOrder(req.body);
        return res.status(StatusCodes.CREATED).json(
            new ApiResponse(
                true,
                "Order created successfully",
                order
            )
        );
    }
);

export const getOrders = asyncHandler(

    async (req, res) => {
        const result = await orderService.getOrders(req.query);
        return res.json(
            new ApiResponse(
                true,
                "Orders fetched successfully",
                result
            )
        );
    }
);

export const getOrder = asyncHandler(

    async (req, res) => {
        const order = await orderService.getOrderById(
            req.params.id
        );
        if (!order) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                "Order not found"
            );
        }
        return res.json(
            new ApiResponse(
                true,
                "Order fetched successfully",
                order
            )
        );
    }
);

export const updateOrder = asyncHandler(
    async (req, res) => {
        const order = await orderService.updateOrder(
            req.params.id,
            req.body
        );

        if (!order) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                "Order not found"
            );
        }

        return res.json(
            new ApiResponse(
                true,
                "Order updated successfully",
                order
            )
        );
    }
);

export const deleteOrder = asyncHandler(
    async (req, res) => {
        const order = await orderService.deleteOrder(
            req.params.id
        );
        if (!order) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                "Order not found"
            );
        }
        return res.json(
            new ApiResponse(
                true,
                "Order deleted successfully",
                null
            )
        );
    }
);