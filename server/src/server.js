import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import connectDatabase from "./config/database.js";
import startSchedulers from "./cron/index.js";

const PORT = process.env.PORT || 5000;
let server;
const startServer = async () => {

    try {
        await connectDatabase();
        server = app.listen(PORT, () => {
            console.log(`Server Running on Port ${PORT}`);
            startSchedulers();
        });

    } catch (error) {
        console.error("Server Startup Failed:", error);
        process.exit(1);
    }
};

const gracefulShutdown = (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    if (server) {
        server.close(() => {
            console.log("HTTP Server Closed.");
            process.exit(0);
        });

    } else {
        process.exit(0);
    }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

startServer();