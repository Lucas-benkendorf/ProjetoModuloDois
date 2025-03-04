import { Router } from "express";
import { createMovement } from "../controllers/MovementController";
import verifyToken from "../middlewares/auth";

const router = Router();

router.post("/", verifyToken, createMovement);


export default router;