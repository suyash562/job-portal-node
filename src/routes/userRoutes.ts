import { Router } from "express";
import { registerController } from "../controller/userController";

const userRouter : Router = Router();

userRouter.post('/register', registerController);

export default userRouter;