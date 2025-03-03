import { Router } from "express";
import {
  createUser,
  updateUser,
  listUsers,
  getUserById,
  updateUserStatus,
} from "../controllers/UserController";
import verifyToken from "../middlewares/auth";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

router.post("/", createUser);
router.put("/:id", verifyToken, updateUser);
router.get("/", verifyToken, listUsers);
router.get("/:id", verifyToken, getUserById);
router.patch("/:id/status", verifyToken, isAdmin, updateUserStatus);

export default router;
