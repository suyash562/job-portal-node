import { Router } from "express";
import { loginController, logoutController, registerController } from "../controller/userController";

const userRouter : Router = Router();

userRouter.post('/register', registerController);
userRouter.post('/login', loginController);
userRouter.get('/logout', logoutController);
// userRouter.get('/isLoggedIn', isUserLoggedInController);

export default userRouter;