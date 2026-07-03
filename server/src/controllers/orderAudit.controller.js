import asyncHandler from "../utils/asyncHandler.js";
import * as auditService from "../services/orderAudit.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getOrderTimeline = asyncHandler(
    async (req, res) => {

        const logs = await auditService.getOrderTimeline(
            req.params.id
        );

        return res.status(200).json(

            new ApiResponse(
                200,
                logs,
                "Timeline fetched successfully."
            )

        );

    }
);