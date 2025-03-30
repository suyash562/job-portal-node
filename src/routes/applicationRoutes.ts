import { Router } from "express";
import { applyForJobController, getApplicationByIdController, getApplicationsForEmployeerController, getApplicationsOfCurrentUserController, getResumeByIdController } from "../controller/applicationController";
import { authenticateUserCredentials } from "../middleware/authenticate";

const applicationRouter : Router = Router();

applicationRouter.get('/apply/:jobId', authenticateUserCredentials, applyForJobController);
applicationRouter.get('/employeer', authenticateUserCredentials, getApplicationsForEmployeerController);
applicationRouter.get('/user', authenticateUserCredentials, getApplicationsOfCurrentUserController);
applicationRouter.get('/resume/:applicationId', authenticateUserCredentials, getResumeByIdController);
applicationRouter.get('/:applicationId', authenticateUserCredentials, getApplicationByIdController);

export default applicationRouter;