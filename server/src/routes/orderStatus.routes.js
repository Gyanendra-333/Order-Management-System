import express from "express";
import { updateOrderStatus } from "../controllers/orderStatus.controller.js";
import validateRequest from "../middlewares/validateRequest.js";
import { updateOrderStatusValidator } from "../validators/orderStatus.validator.js";

const router = express.Router();

router.patch("/:id/status", updateOrderStatusValidator, validateRequest, updateOrderStatus);

export default router;