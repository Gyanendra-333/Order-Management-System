import express from "express";
import schedulerController from "../controllers/scheduler.controller.js";

const router = express.Router();

router.get("/status", schedulerController.getSchedulerStatus);

export default router;