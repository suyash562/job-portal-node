import { Router } from "express";
import { getResumeByIdController, getUserProfileController, getUserRoleController, loginController, logoutController, registerController, uploadResumeController } from "../controller/userController";
import { authenticateUserCredentials } from "../middleware/authenticate";
import multer from 'multer';
import path from 'path';
import fs from 'fs';


function getResumesCount(email : string) : string {
  let fileName : string = '1';
  let path : string = `./public/documents/${email}`;

  try{
    if(fs.existsSync(path)){
      const files = fs.readdirSync(path);
      fileName = (files.length + 1).toString();
    }
    else{
      fs.mkdirSync(path);
    }
    return fileName;
  }
  catch(err) {
    console.log(err);
    return fileName;
  }
}

const multerUpload = multer({ 
    storage : multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, `./public/documents/${req.body.email}`)
      },
      filename: function (req, file, cb) {
        cb(null, getResumesCount(req.body.email) + path.extname(file.originalname))
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
userRouter.get('/resume/:resumeNumber', authenticateUserCredentials, getResumeByIdController);
userRouter.post('/upload/resume', authenticateUserCredentials, multerUpload.single('resume'), uploadResumeController);

export default userRouter;