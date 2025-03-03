import { Router } from "express";
import { createProduct } from "../controllers/ProductController";
import verifyToken from "../middlewares/auth";

const router = Router();


router.post("/", verifyToken, createProduct);

export default router;
