import { Router } from "express";

import {
  getSections,
  createSections,
  updateSection,
  deleteSection,
} from "../controllers/sectionController.js";

const router = Router();

router.get("/", getSections);
router.post("/", createSections);
router.put("/:id", updateSection);
router.delete("/:id", deleteSection);

export default router;
