import express from "express";
import cors from "cors";

// Import routes
import examRoutes from "./routes/examRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Attach routes
app.use("/api/exams", examRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/results", resultRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => res.send("System Online"));

export default app;
