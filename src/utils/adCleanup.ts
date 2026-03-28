import nodeCron from "node-cron";
import Ad from "../models/Ad.js";
import fs from "fs";
import path from "path";

export const initAdCleanup = () => {
  // Run every day at midnight
  nodeCron.schedule("0 0 * * *", async () => {
    console.log("Running Ad Cleanup Task...");
    try {
      const expiredAds = await Ad.find({ expiresAt: { $lt: new Date() } });

      for (const ad of expiredAds) {
        if (ad.image) {
          const imagePath = path.join(process.cwd(), ad.image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`Deleted image: ${imagePath}`);
          }
        }
        await Ad.findByIdAndDelete(ad._id);
        console.log(`Deleted expired ad: ${ad.title}`);
      }
    } catch (error) {
      console.error("Error in Ad Cleanup Task:", error);
    }
  });
};
