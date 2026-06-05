import { Router } from "express";
import {
  clearUsers,
  createGuest,
  createUsers,
  getAllUsers,
  getUser,
  loginCollab,
  loginUser,
  updateRole,
  updateUser,
} from "../controllers/userController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = Router();

// Mount specific routers
router.get("/", getAllUsers);
router.post("/", createUsers);
router.post("/guest", createGuest);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.put("/:id/role", auth, updateRole);
router.delete("/:id", clearUsers);

router.post("/auth", loginUser);
router.post("/auth/collabs", loginCollab);

export default router;
