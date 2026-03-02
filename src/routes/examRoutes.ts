import { Router } from "express";
import {
  getExams,
  createExam,
  updateExam,
  deleteExam,
  getExam,
} from "../controllers/examController.js";

const router = Router();

router.get("/", getExams);
router.post("/", createExam);
router.get("/:id", getExam);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

export default router;
