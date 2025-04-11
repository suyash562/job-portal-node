import { Router } from "express";
import { approveEmployerRequestController, deleteResumeController, forgotPasswordController, getAllRegisteredUsersForAdminController, getNotVerifiedEmployersController, getResumeByIdController, getUserInfoForAdminController, getUserProfileController, getUserRoleController, loginController, logoutController, registerController, resendOtpController, resetPasswordController, updatePrimaryResumeController, updateUserAccountStatusController, updateUserPasswordController, updateUserProfileController, uploadResumeController, verifyOtpController } from "../controller/userController";
import { authenticateUserCredentials } from "../middleware/authenticate";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { validate, validateUserData } from "../validators/validator";
import { userSchema } from "../validators/validationSchema";
import { validateParams } from "../validators/paramsValidator";
import { verifyRole } from "../middleware/roleVerification";


function getResumesCount(email : string) : string {
  let fileName : string = '1';
  let path : string = `./public/documents/userResume/${email}`;

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
        cb(null, `./public/documents/userResume/${req.body.email}`)
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

userRouter.post('/register', multerUpload.single('resume'), validateUserData, registerController);
userRouter.post('/login', validate(['email'], userSchema, 'user'), loginController);
userRouter.get('/logout', logoutController);
userRouter.get('/forgot-password/:userEmail', forgotPasswordController);
userRouter.get('/userProfile', authenticateUserCredentials, getUserProfileController);
userRouter.post('/userProfile/update', validate(['firstName','lastName','address'], userSchema, 'userProfile'), authenticateUserCredentials, updateUserProfileController);
userRouter.get('/role', authenticateUserCredentials, getUserRoleController);
userRouter.post('/password/update', authenticateUserCredentials, updateUserPasswordController);
userRouter.post('/verify-otp', verifyOtpController);
userRouter.post('/resend-otp', resendOtpController);
userRouter.post('/reset-password', resetPasswordController);
userRouter.get('/resume/:resumeNumber', authenticateUserCredentials, validateParams(['resumeNumber']), getResumeByIdController);

userRouter.post('/resume/upload', authenticateUserCredentials, verifyRole('user'), multerUpload.single('resume'), uploadResumeController);
userRouter.post('/resume/updatePrimary', authenticateUserCredentials, verifyRole('user'), updatePrimaryResumeController);
userRouter.post('/resume/delete', authenticateUserCredentials, verifyRole('user'), deleteResumeController);

userRouter.get('/verified-users', authenticateUserCredentials, verifyRole('admin'), getAllRegisteredUsersForAdminController);
userRouter.get('/info-for-admin', authenticateUserCredentials, verifyRole('admin'), getUserInfoForAdminController);
userRouter.get('/employerDetails', authenticateUserCredentials, verifyRole('admin'), getNotVerifiedEmployersController);
userRouter.get('/approve-employer/:employerEmail', authenticateUserCredentials, verifyRole('admin'), approveEmployerRequestController);
userRouter.get('/update-account-status/:email/:status', authenticateUserCredentials, verifyRole('admin'), updateUserAccountStatusController);

export default userRouter;


// userRouter.post('/delete/not-verified', deleteUserIfNotVerifiedController);