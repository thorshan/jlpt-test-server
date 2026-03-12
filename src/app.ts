import express from "express";
import cors from "cors";
import { dbConnection } from "./config/database.js";

// Import Routes
import examRoutes from "./routes/examRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await dbConnection();
    next();
  } catch (error) {
    res.status(503).json({ error: "Database connection failed" });
  }
});

app.use("/api/exams", examRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/activities", activityRoutes);

app.get("/api/health", (req, res) => res.send("System Online"));

export default app;
