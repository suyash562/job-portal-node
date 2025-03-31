import { Router } from "express";
import { addInterviewScheduleController } from "../controller/InterviewScheduleController";
import { authenticateUserCredentials } from "../middleware/authenticate";

const interviewScheduleRouter : Router = Router();

interviewScheduleRouter.post('/add', authenticateUserCredentials ,addInterviewScheduleController);


export default interviewScheduleRouter;