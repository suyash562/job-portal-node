import { Router } from "express";
import { getUserProfileController, getUserRoleController, loginController, logoutController, registerController } from "../controller/userController";
import { authenticateUserCredentials } from "../middleware/authenticate";

const userRouter : Router = Router();

userRouter.post('/register', registerController);
userRouter.post('/login', loginController);
userRouter.get('/logout', logoutController);
userRouter.get('/userProfile', authenticateUserCredentials, getUserProfileController);
userRouter.get('/role', authenticateUserCredentials, getUserRoleController);
// userRouter.get('/isLoggedIn', isUserLoggedInController);

export default userRouter;