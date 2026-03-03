import { Router } from "express";
import { examResult, getResults } from "../controllers/resultController.js";

const router = Router();

router.get("/:userId", getResults);
router.post("/", examResult);

export default router;
