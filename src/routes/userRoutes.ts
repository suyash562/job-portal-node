import { Router } from "express";
import { getUserProfileController, getUserRoleController, loginController, logoutController, registerController } from "../controller/userController";
import { authenticateUserCredentials } from "../middleware/authenticate";
import multer from 'multer';
import path from 'path';

const multerUpload = multer({ 
    storage : multer.diskStorage({
      destination: './public/documents',
      filename: function (req, file, cb) {
        cb(null, req.body.email + path.extname(file.originalname))
      }
    }),
    fileFilter : (req, file, callback) => {
      if(path.extname(file.originalname) !== '.pdf' || file.size > 10 * 1024 * 1024){
        callback(null, false);
      }
      else{
        callback(null, true);
      }
    }
});

const userRouter : Router = Router();

userRouter.post('/register', multerUpload.single('resume'), registerController);
userRouter.post('/login', loginController);
userRouter.get('/logout', logoutController);
userRouter.get('/userProfile', authenticateUserCredentials, getUserProfileController);
userRouter.get('/role', authenticateUserCredentials, getUserRoleController);

export default userRouter;