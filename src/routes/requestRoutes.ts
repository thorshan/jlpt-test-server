import { Router } from "express";
import {
  createRequest,
  getRequests,
  updateRequest,
  deleteRequest,
} from "../controllers/requestController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = Router();

// Public route for creating requests
router.post("/", createRequest);

// Protected admin routes
router.get("/", auth, getRequests);
router.put("/:id", auth, updateRequest);
router.delete("/:id", auth, deleteRequest);

export default router;
