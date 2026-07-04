import { startOrderScheduler } from "./orderScheduler.js";
import { startCleanupScheduler } from "./cleanupScheduler.js";

let schedulerStarted = false;

export const startSchedulers = () => {
    if (schedulerStarted) {
        return;
    }

    console.log("Initializing Scheduler Module...");
    if (process.env.ENABLE_ORDER_SCHEDULER === "true") {
        startOrderScheduler();
    } else {
        console.log("Order Scheduler Disabled");
    }

    if (process.env.ENABLE_CLEANUP_SCHEDULER === "true") {
        startCleanupScheduler();
    } else {
        console.log("Cleanup Scheduler Disabled");
    }

    schedulerStarted = true;
    console.log("Scheduler Module Initialized.");

};

export default startSchedulers;