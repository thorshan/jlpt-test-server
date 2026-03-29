import { Router } from "express";
import {
  clearUsers,
  createUsers,
  getAllUsers,
  getUser,
  loginUser,
  updateRole,
  updateUser,
} from "../controllers/userController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = Router();

// Mount specific routers
router.get("/", auth, getAllUsers);
router.post("/", createUsers);
router.get("/:id", getUser);
router.put("/:id", auth, updateUser);
router.put("/:id/role", auth, updateRole);
router.delete("/:id", clearUsers);

router.post("/auth", loginUser);

export default router;
