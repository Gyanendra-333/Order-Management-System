import { body } from "express-validator";
import { ORDER_STATUS, PAYMENT_STATUS } from "../models/Order.js";

export const createOrderValidator = [
    body("customerName")
        .trim()
        .notEmpty()
        .withMessage("Customer name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Customer name must be between 2 and 100 characters"),

    body("phoneNumber")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required")
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Enter a valid Indian phone number"),

    body("productName")
        .trim()
        .notEmpty()
        .withMessage("Product name is required")
        .isLength({ min: 2, max: 200 })
        .withMessage("Product name must be between 2 and 200 characters"),

    body("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .isFloat({ gt: 0 })
        .withMessage("Amount must be greater than zero"),

    body("paymentStatus")
        .optional()
        .isIn(Object.values(PAYMENT_STATUS))
        .withMessage("Invalid payment status")
];

export const updateOrderValidator = [

    body("customerName")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }),

    body("phoneNumber")
        .optional()
        .matches(/^[6-9]\d{9}$/),

    body("productName")
        .optional()
        .trim()
        .isLength({ min: 2, max: 200 }),

    body("amount")
        .optional()
        .isFloat({ gt: 0 }),

    body("paymentStatus")
        .optional()
        .isIn(Object.values(PAYMENT_STATUS)),

    body("status")
        .optional()
        .isIn(Object.values(ORDER_STATUS))
];