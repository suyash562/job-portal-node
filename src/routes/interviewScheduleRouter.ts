import { Router } from "express";
import { authenticateUserCredentials } from "../middleware/authenticate";
import { addInterviewScheduleController, getScheduledInterviewsController } from "../controller/interviewScheduleController";
import { validate, validateDate, validateTime } from "../validators/validator";
import { interviewScheduleSchema } from "../validators/validationSchema";
import { validateParams } from "../validators/paramsValidator";

const interviewScheduleRouter : Router = Router();

interviewScheduleRouter.post(
    '/add',
    validate([
        'interviewType',
        'meetingUrl',
        'address',
        'instructions'
    ], interviewScheduleSchema, 'interviewSchedule'),
    validateDate('interviewSchedule', 'interviewDate'),
    validateTime('interviewSchedule', 'interviewTime'),
    authenticateUserCredentials,
    addInterviewScheduleController
);
    
interviewScheduleRouter.get('/applicantSchedules/:applicationId', validateParams(['applicationId']), authenticateUserCredentials ,getScheduledInterviewsController);


export default interviewScheduleRouter;