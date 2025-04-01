import { Router } from "express";
import { authenticateUserCredentials } from "../middleware/authenticate";
import { addInterviewScheduleController, getScheduledInterviewsController } from "../controller/interviewScheduleController";

const interviewScheduleRouter : Router = Router();

interviewScheduleRouter.post('/add', authenticateUserCredentials ,addInterviewScheduleController);
interviewScheduleRouter.get('/applicantSchedules/:applicationId', authenticateUserCredentials ,getScheduledInterviewsController);


export default interviewScheduleRouter;