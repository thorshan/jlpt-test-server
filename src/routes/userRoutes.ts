import { Router } from "express";
import {
  clearUsers,
  createUsers,
  getAllUsers,
  updateUser,
} from "../controllers/userController.js";

const router = Router();

// Mount specific routers
router.get("/", getAllUsers);
router.post("/", createUsers);
router.put("/:id", updateUser);
router.delete("/:id", clearUsers);

export default router;
