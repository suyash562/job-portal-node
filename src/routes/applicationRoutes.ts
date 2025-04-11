import { Router } from "express";
import { applyForJobController, getApplicationByIdController, getApplicationsForEmployeerController, getApplicationsOfCurrentUserController, getResumeByApplicationIdController, updateUserApplicationStatusController } from "../controller/applicationController";
import { authenticateUserCredentials } from "../middleware/authenticate";
import { validateParams } from "../validators/paramsValidator";
import { verifyRole } from "../middleware/roleVerification";

const applicationRouter : Router = Router();


applicationRouter.get('/apply/:jobId', authenticateUserCredentials, validateParams(['jobId']), verifyRole('user'), applyForJobController);
applicationRouter.get('/user', authenticateUserCredentials, verifyRole('user'), getApplicationsOfCurrentUserController);

applicationRouter.get('/employeer', authenticateUserCredentials, verifyRole('employeer'), getApplicationsForEmployeerController);
applicationRouter.get('/resume/:applicationId', authenticateUserCredentials, validateParams(['applicationId']), getResumeByApplicationIdController);

applicationRouter.get('/:applicationStatus/:applicationId', authenticateUserCredentials, verifyRole('employeer'), updateUserApplicationStatusController);
applicationRouter.get('/:applicationId', authenticateUserCredentials, validateParams(['applicationId']), getApplicationByIdController);

export default applicationRouter;