import ApiResponse from "../utils/ApiResponse.js";

const schedulerSecret = (req, res, next) => {

    const secret = req.headers["x-scheduler-secret"];

    if (!secret) {

        return res.status(401).json(

            new ApiResponse(false, "Scheduler Secret Missing")

        );

    }

    if (secret !== process.env.SCHEDULER_SECRET) {

        return res.status(403).json(

            new ApiResponse(false, "Invalid Scheduler Secret")

        );

    }

    next();

};

export default schedulerSecret;