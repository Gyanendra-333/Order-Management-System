import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import orderRoutes from "./routes/order.routes.js";
import orderStatusRoutes from "./routes/orderStatus.routes.js";
import orderAuditRoutes from "./routes/orderAudit.routes.js";
import schedulerRoutes from "./routes/scheduler.routes.js";

const app = express();

app.use(helmet());
app.use(compression());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);

app.use(
    express.json({
        limit: "10mb"
    })
);

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(morgan("dev"));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use(limiter);

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Order Management API Running Successfully"
    });

});

app.use("/api/orders", orderRoutes);
app.use("/api/orders", orderStatusRoutes);
app.use("/api/orders", orderAuditRoutes);
app.use("/api/scheduler", schedulerRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;