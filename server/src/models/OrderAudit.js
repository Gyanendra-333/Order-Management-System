import mongoose from "mongoose";

const orderAuditSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            index: true
        },

        action: {
            type: String,
            required: true
        },

        previousStatus: {
            type: String,
            default: null
        },

        currentStatus: {
            type: String,
            default: null
        },

        performedBy: {
            type: String,
            default: "SYSTEM"
        },

        reason: {
            type: String,
            default: ""
        },

        metadata: {
            type: Object,
            default: {}
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model("OrderAudit", orderAuditSchema);