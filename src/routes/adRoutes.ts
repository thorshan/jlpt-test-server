import { Router } from "express";
import {
  createAd,
  deleteAd,
  getAds,
  getRandomAd,
  updateAd,
  trackClick,
} from "../controllers/adController.js";

import { auth, sAdmin } from "../middleware/authMiddleware.js";

const router = Router();

// Public Routes
router.get("/random", getRandomAd);
router.post("/:id/click", trackClick);

// Super-Admin Protected Routes

router.get("/", auth, sAdmin, getAds);
router.post("/", auth, sAdmin, createAd);
router.put("/:id", auth, sAdmin, updateAd);
router.delete("/:id", auth, sAdmin, deleteAd);

export default router;
