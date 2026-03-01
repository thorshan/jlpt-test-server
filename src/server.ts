import dotenv from "dotenv";
dotenv.config();

import { dbConnection } from "./config/database.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await dbConnection();

    app.listen(PORT, () => {
      console.log(`[SYSTEM] : Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
