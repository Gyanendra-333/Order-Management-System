import SchedulerLog from "../models/SchedulerLog.js";

class SchedulerController {

    async getSchedulerStatus(req, res, next) {
        try {
            const latestRun = await SchedulerLog.findOne()
                .sort({ createdAt: -1 })
                .lean();
            return res.status(200).json({
                success: true,
                message: "Scheduler status fetched successfully.",
                data: latestRun
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new SchedulerController();