import { Router } from "express";
import { createMovement, listMovements } from "../controllers/MovementController";
import verifyToken from "../middlewares/auth";

const router = Router();

router.post("/", verifyToken, createMovement);
router.get("/", verifyToken, listMovements); 

export default router;