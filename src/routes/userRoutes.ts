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

const router = Router();

// Mount specific routers
router.get("/", getAllUsers);
router.post("/", createUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.put("/:id/role", updateRole);
router.delete("/:id", clearUsers);

router.post("/auth", loginUser);

export default router;
