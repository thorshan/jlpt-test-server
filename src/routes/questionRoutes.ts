import { Router } from "express";
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", auth, getQuestions);
router.post("/", auth, createQuestion);
router.put("/:id", auth, updateQuestion);
router.delete("/:id", auth, deleteQuestion);

export default router;
