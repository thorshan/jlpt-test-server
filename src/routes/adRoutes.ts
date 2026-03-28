import { Router } from "express";
import {
  createAd,
  deleteAd,
  getAds,
  getRandomAd,
} from "../controllers/adController.js";
import { auth, admin } from "../middleware/authMiddleware.js";

const router = Router();

// Public Routes
router.get("/random", getRandomAd);

// Admin Protected Routes
router.get("/", auth, admin, getAds);
router.post("/", auth, admin, createAd);
router.delete("/:id", auth, admin, deleteAd);

export default router;
