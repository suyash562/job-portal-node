import { Router } from "express";
import { getNotificationsOfCurrentUserController, markNotificationAsReadController } from "../controller/notificationController";
import { authenticateUserCredentials } from "../middleware/authenticate";


export const notificationRouter : Router = Router();
    
notificationRouter.get('/getAll', authenticateUserCredentials, getNotificationsOfCurrentUserController);
notificationRouter.post('/mark-as-read', authenticateUserCredentials, markNotificationAsReadController);