import { Router } from "express";
import { applyForJobController, getApplicationByIdController, getApplicationsForEmployeerController, getApplicationsOfCurrentUserController, getResumeByApplicationIdController, updateUserApplicationStatusController } from "../controller/applicationController";
import { authenticateUserCredentials } from "../middleware/authenticate";

const applicationRouter : Router = Router();

applicationRouter.get('/apply/:jobId', authenticateUserCredentials, applyForJobController);
applicationRouter.get('/employeer', authenticateUserCredentials, getApplicationsForEmployeerController);
applicationRouter.get('/user', authenticateUserCredentials, getApplicationsOfCurrentUserController);
applicationRouter.get('/resume/:applicationId', authenticateUserCredentials, getResumeByApplicationIdController);
applicationRouter.get('/:applicationStatus/:applicationId', authenticateUserCredentials, updateUserApplicationStatusController);
applicationRouter.get('/:applicationId', authenticateUserCredentials, getApplicationByIdController);

export default applicationRouter;