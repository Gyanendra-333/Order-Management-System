import { body } from "express-validator";
import { ORDER_STATUS } from "../models/Order.js";

export const updateOrderStatusValidator = [

    body("status")
        .notEmpty()
        .withMessage("Status is required")

        .isIn(Object.values(ORDER_STATUS))
        .withMessage("Invalid order status")

];