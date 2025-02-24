import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin"; 
import { createUser, getUserById, listUsers } from "../controllers/UserController"; 

const router = Router();


router.get("/", isAdmin, listUsers);


router.get("/:id", isAdmin, getUserById);


router.post("/", createUser);

export default router;