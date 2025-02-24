import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin";
import { createUser, listUsers } from "../controllers/UserController";

const userRouter = Router();

userRouter.post("/", isAdmin, createUser);
userRouter.get("/", isAdmin, listUsers); 

export default userRouter;
