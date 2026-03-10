import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const MONGO_URI = process.env.DB_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not defined");
}

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("[MONGODB] : Database connected");

    app.listen(PORT, () => {
      console.log(`[SYSTEM] : Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("[SYSTEM] : Failed to connect to MongoDB", error);
    process.exit(1);
  }
})();
