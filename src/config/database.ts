import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const MONGO_URI = process.env.DB_URI;

export const dbConnection = async () => {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log("[SYSTEM] : DATABASE is CONNECTED.");
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};
