import mongoose from "mongoose";

const schedulerLogSchema = new mongoose.Schema(
    {
        startedAt: {
            type: Date,
            required: true
        },

        endedAt: {
            type: Date,
            required: true
        },

        ordersChecked: {
            type: Number,
            default: 0
        },

        ordersUpdated: {
            type: Number,
            default: 0
        },

        success: {
            type: Boolean,
            default: true
        },

        executionTime: {
            type: Number,
            default: 0
        },

        errors: [
            {
                type: String
            }
        ]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

schedulerLogSchema.index({
    createdAt: -1
});

const SchedulerLog = mongoose.model(
    "SchedulerLog",
    schedulerLogSchema
);

export default SchedulerLog;