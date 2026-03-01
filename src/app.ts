import express from "express";
import cors from "cors";
export const app = express();

app.use(cors());
app.use(express.json());

import examRoutes from "./routes/examRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import userRoutes from "./routes/userRoutes.js";

app.use("/api/exams", examRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/users", userRoutes);

export default app;
