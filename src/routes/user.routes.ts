import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin";
import { createUser } from "../controllers/UserController";

const userRouter = Router();

userRouter.post("/", isAdmin, createUser); 


export default userRouter;