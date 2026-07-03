import express from "express";

import {
    getOrderTimeline
} from "../controllers/orderAudit.controller.js";

const router = express.Router();

router.get("/:id/timeline", getOrderTimeline);

export default router;