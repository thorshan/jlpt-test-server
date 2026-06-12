import { Router } from "express";
import {
  examResult,
  getAllResults,
  getResultByUser,
  getResults,
  getResultsById,
} from "../controllers/resultController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", auth, getAllResults);
router.get("/:userId", auth, getResults);
router.get("/result/:id", auth, getResultsById);
router.post("/", auth, examResult);
router.get("/user/:id", auth, getResultByUser);

export default router;
