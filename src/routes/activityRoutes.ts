import { Router } from "express";
import Activity from "../models/Activity.js";
import { auth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const logs = await Activity.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity logs",
    });
  }
});

export default router;
