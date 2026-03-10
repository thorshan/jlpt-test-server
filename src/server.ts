import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) throw new Error("MONGO_URI not defined");

mongoose
  .connect(mongoUri)
  .then(() => console.log("[MONGODB] Connected"))
  .catch((err) => {
    console.error("[MONGODB] Connection failed", err);
    process.exit(1);
  });
