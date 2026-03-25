import { Router } from "express";
import {
  getExams,
  createExam,
  updateExam,
  deleteExam,
  getExam,
} from "../controllers/examController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", auth, getExams);
router.post("/", auth, createExam);
router.get("/:id", auth, getExam);
router.put("/:id", auth, updateExam);
router.delete("/:id", auth, deleteExam);

export default router;
