import mongoose from "mongoose";

export const ORDER_STATUS = {
    PLACED: "PLACED",
    PROCESSING: "PROCESSING",
    READY_TO_SHIP: "READY_TO_SHIP",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED"
};

export const PAYMENT_STATUS = {
    PENDING: "PENDING",
    PAID: "PAID",
    FAILED: "FAILED",
    REFUNDED: "REFUNDED"
};

const statusHistorySchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: Object.values(ORDER_STATUS),
            required: true
        },

        changedAt: {
            type: Date,
            default: Date.now
        },

        changedBy: {
            type: String,
            default: "SYSTEM"
        }
    },
    {
        _id: false
    }
);

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },

        customerName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        phoneNumber: {
            type: String,
            required: true,
            trim: true
        },

        productName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },

        amount: {
            type: Number,
            required: true,
            min: 1
        },

        paymentStatus: {
            type: String,
            enum: Object.values(PAYMENT_STATUS),
            default: PAYMENT_STATUS.PENDING
        },

        status: {
            type: String,
            enum: Object.values(ORDER_STATUS),
            default: ORDER_STATUS.PLACED
        },

        statusHistory: {
            type: [statusHistorySchema],
            default: [
                {
                    status: ORDER_STATUS.PLACED,
                    changedBy: "SYSTEM"
                }
            ]
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

orderSchema.index({ orderId: 1 });
orderSchema.index({ customerName: 1 });
orderSchema.index({ phoneNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;