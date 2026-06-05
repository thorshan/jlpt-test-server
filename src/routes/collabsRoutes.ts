import { Router } from "express";
import {
  getAllCollabs,
  createCollabs,
  addUserToCollab,
  updateCollabStatus,
} from "../controllers/collabsController.js";

import { auth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAllCollabs);
router.post("/", auth, createCollabs);
router.put("/:collabId/:id", auth, addUserToCollab);
router.patch("/:id", auth, updateCollabStatus);

export default router;
