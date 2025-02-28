import { Router } from "express";
import { createUser, updateUser, listUsers, getUserById } from "../controllers/UserController";
import verifyToken from "../middlewares/auth";

const router = Router();

router.post("/", createUser);
router.put("/:id", verifyToken, updateUser);
router.get("/", verifyToken, listUsers);
router.get("/:id", verifyToken, getUserById);

export default router;
