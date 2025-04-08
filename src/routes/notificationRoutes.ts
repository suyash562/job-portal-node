import { Router } from "express";
import { getNotificationsOfCurrentUserController, markNotificationAsReadController } from "../controller/notificationController";
import { authenticateUserCredentials } from "../middleware/authenticate";
import { validateParams } from "../validators/paramsValidator";


export const notificationRouter : Router = Router();
    
notificationRouter.get('/getAll', authenticateUserCredentials, getNotificationsOfCurrentUserController);
notificationRouter.get('/mark-as-read/:notificationId', validateParams(['notificationId']), authenticateUserCredentials, markNotificationAsReadController);