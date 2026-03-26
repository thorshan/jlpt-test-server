import { Router } from "express";
import {
  examResult,
  getAllResults,
  getResults,
  getResultsById,
} from "../controllers/resultController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", auth, getAllResults);
router.get("/:userId", auth, getResults);
router.get("/result/:id", auth, getResultsById);
router.post("/", auth, examResult);

export default router;
