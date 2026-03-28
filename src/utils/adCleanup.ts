import nodeCron from "node-cron";
import Ad from "../models/Ad.js";

export const initAdCleanup = () => {
  // Run every day at midnight
  nodeCron.schedule("0 0 * * *", async () => {
    console.log("Running Ad Cleanup Task...");
    try {
      const result = await Ad.deleteMany({ expiresAt: { $lt: new Date() } });
      console.log(`Deleted ${result.deletedCount} expired ads`);
    } catch (error) {
      console.error("Error in Ad Cleanup Task:", error);
    }
  });
};
