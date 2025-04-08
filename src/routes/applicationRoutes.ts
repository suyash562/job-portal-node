import { Router } from "express";
import { applyForJobController, getApplicationByIdController, getApplicationsForEmployeerController, getApplicationsOfCurrentUserController, getResumeByApplicationIdController, updateUserApplicationStatusController } from "../controller/applicationController";
import { authenticateUserCredentials } from "../middleware/authenticate";
import { validateParams } from "../validators/paramsValidator";

const applicationRouter : Router = Router();

applicationRouter.get('/apply/:jobId', authenticateUserCredentials, validateParams(['jobId']), applyForJobController);
applicationRouter.get('/employeer', authenticateUserCredentials, getApplicationsForEmployeerController);
applicationRouter.get('/user', authenticateUserCredentials, getApplicationsOfCurrentUserController);
applicationRouter.get('/resume/:applicationId', authenticateUserCredentials, validateParams(['applicationId']), getResumeByApplicationIdController);
applicationRouter.get('/:applicationStatus/:applicationId', authenticateUserCredentials, updateUserApplicationStatusController);
applicationRouter.get('/:applicationId', authenticateUserCredentials, validateParams(['applicationId']), getApplicationByIdController);

export default applicationRouter;