import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createAd,
  deleteAd,
  getAds,
  getRandomAd,
} from "../controllers/adController.js";
import { auth, admin } from "../middleware/authMiddleware.js";

const router = Router();

// Multer Storage Configuration
const uploadDir = path.join(process.cwd(), "uploads", "ads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});


const upload = multer({ storage: storage });

// Public Routes
router.get("/random", getRandomAd);

// Admin Protected Routes
router.get("/", auth, admin, getAds);
router.post("/", auth, admin, upload.single("image"), createAd);
router.delete("/:id", auth, admin, deleteAd);

export default router;
