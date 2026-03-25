import { Router } from "express";
import {
  examResult,
  getAllResults,
  getResults,
} from "../controllers/resultController.js";

const router = Router();

router.get("/", getAllResults);
router.get("/:userId", getResults);
router.post("/", examResult);

export default router;
