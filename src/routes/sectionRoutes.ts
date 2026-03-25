import { Router } from "express";

import {
  getSections,
  createSections,
  updateSection,
  deleteSection,
} from "../controllers/sectionController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", auth, getSections);
router.post("/", auth, createSections);
router.put("/:id", auth, updateSection);
router.delete("/:id", auth, deleteSection);

export default router;
