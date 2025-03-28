import { Router } from "express";
import { applyForJobController, getApplicationsForEmployeerController, getApplicationsOfCurrentUserController } from "../controller/applicationController";
import { authenticateUserCredentials } from "../middleware/authenticate";

const applicationRouter : Router = Router();

applicationRouter.get('/apply/:jobId', authenticateUserCredentials, applyForJobController);
applicationRouter.get('/employeer', authenticateUserCredentials, getApplicationsForEmployeerController);
applicationRouter.get('/user', authenticateUserCredentials, getApplicationsOfCurrentUserController);

export default applicationRouter;