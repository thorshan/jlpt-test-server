import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { dbConnection } from "./config/database.js";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await dbConnection();
    console.log("[MONGODB] : Database connected");

    app.listen(PORT, () => {
      console.log(`[SYSTEM] : Local Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("[MONGODB] : Failed to connect to DB", error);
    process.exit(1);
  }
})();
