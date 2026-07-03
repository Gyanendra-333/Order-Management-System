import mongoose from "mongoose";
import Order from "../models/Order.js";
import generateOrderId from "../utils/generateOrderId.js";
import { validateStatusTransition } from "../utils/orderWorkflow.js";
import { createAudit } from "./orderAudit.service.js";

class OrderService {

    async createOrder(data) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {

            const order = await Order.create(
                [{
                    orderId: generateOrderId(),
                    customerName: data.customerName,
                    phoneNumber: data.phoneNumber,
                    productName: data.productName,
                    amount: data.amount,
                    paymentStatus: data.paymentStatus || "PENDING"
                }],
                { session }
            );

            await createAudit({

                order: order[0]._id,
                action: "ORDER_CREATED",
                currentStatus: order[0].status,
                performedBy: "SYSTEM"

            });

            await session.commitTransaction();
            return order[0];

        } catch (error) {

            await session.abortTransaction();
            throw error;
        } finally {

            session.endSession();

        }

    }

    async getOrders(query) {

        const {

            page = 1,
            limit = 10,
            status,
            search,
            sort = "-createdAt"

        } = query;

        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (search) {

            filter.$or = [

                {
                    orderId: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    customerName: {
                        $regex: search,
                        $options: "i"
                    }
                }

            ];

        }

        const total = await Order.countDocuments(filter);
        const orders = await Order.find(filter)

            .sort(sort)
            .skip((page - 1) * Number(limit))
            .limit(Number(limit));

        return {

            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            orders

        };

    }

    async getOrderById(id) {

        return await Order.findById(id);

    }

    async updateOrder(id, payload) {

        const session = await mongoose.startSession();
        session.startTransaction();

        try {

            const order = await Order.findById(id).session(session);

            if (!order) {
                await session.abortTransaction();
                return null;

            }

            const previousStatus = order.status;

            if (
                payload.status &&
                payload.status !== order.status
            ) {
                validateStatusTransition(
                    order.status,
                    payload.status
                );
                order.statusHistory.push({
                    status: payload.status,
                    changedBy: "ADMIN",
                    changedAt: new Date()
                });
            }

            Object.assign(order, payload);
            await order.save({
                session
            });
            if (
                previousStatus !== order.status
            ) {

                await createAudit({
                    order: order._id,
                    action: "STATUS_UPDATED",
                    previousStatus,
                    currentStatus: order.status,
                    performedBy: "ADMIN"
                });
            }

            await session.commitTransaction();
            return order;

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async deleteOrder(id) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const order = await Order.findById(id).session(session);
            if (!order) {
                await session.abortTransaction();
                return null;
            }
            await createAudit({
                order: order._id,
                action: "ORDER_DELETED",
                previousStatus: order.status,
                currentStatus: null,
                performedBy: "ADMIN"
            });

            await Order.deleteOne({
                _id: id
            }).session(session);
            await session.commitTransaction();
            return order;
        } catch (error) {

            await session.abortTransaction();
            throw error;

        } finally {
            session.endSession();
        }
    }
}

export default new OrderService();