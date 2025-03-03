import { Router } from "express";
import { createProduct, listProducts } from "../controllers/ProductController";
import verifyToken from "../middlewares/auth";

const router = Router();

router.post("/", verifyToken, createProduct);
router.get("/", verifyToken, listProducts);

export default router;
