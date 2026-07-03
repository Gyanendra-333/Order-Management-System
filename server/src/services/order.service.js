import Order from "../models/Order.js";
import generateOrderId from "../utils/generateOrderId.js";

class OrderService {

    async createOrder(data) {

        const order = await Order.create({
            orderId: generateOrderId(),
            customerName: data.customerName,
            phoneNumber: data.phoneNumber,
            productName: data.productName,
            amount: data.amount,
            paymentStatus: data.paymentStatus || "PENDING"

        });

        return order;

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
            .skip((page - 1) * limit)
            .limit(Number(limit));

        return {

            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            orders
        };

    }

    async getOrderById(id) {
        return await Order.findById(id);

    }

    async updateOrder(id, payload) {

        const order = await Order.findById(id);
        if (!order) {
            return null;
        }

        if (
            payload.status &&
            payload.status !== order.status
        ) {
            order.statusHistory.push({
                status: payload.status,
                changedBy: "ADMIN",
                changedAt: new Date()
            });
        }

        Object.assign(order, payload);

        await order.save();
        return order;

    }

    async deleteOrder(id) {
        return await Order.findByIdAndDelete(id);
    }
}
export default new OrderService();