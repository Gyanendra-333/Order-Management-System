import express from "express";

import {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder
} from "../controllers/order.controller.js";

import validateRequest from "../middlewares/validateRequest.js";

import {
    createOrderValidator,
    updateOrderValidator
} from "../validators/order.validator.js";

const router = express.Router();

router.post("/", createOrderValidator, validateRequest, createOrder);
router.get("/", getOrders);
router.get("/:id", getOrder);
router.put("/:id", updateOrderValidator, validateRequest, updateOrder);
router.delete("/:id", deleteOrder);

export default router;