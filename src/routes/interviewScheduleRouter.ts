import { Router } from "express";
import { authenticateUserCredentials } from "../middleware/authenticate";
import { addInterviewScheduleController, getScheduledInterviewsController } from "../controller/interviewScheduleController";
import { validate, validateDate, validateTime } from "../validators/validator";
import { interviewScheduleSchema } from "../validators/validationSchema";
import { validateParams } from "../validators/paramsValidator";
import { verifyRole } from "../middleware/roleVerification";

const interviewScheduleRouter : Router = Router();

interviewScheduleRouter.post(
    '/add',
    authenticateUserCredentials,
    verifyRole('employeer'),
    validate([
        'interviewType',
        'meetingUrl',
        'address',
        'instructions'
    ], interviewScheduleSchema, 'interviewSchedule'),
    validateDate('interviewSchedule', 'interviewDate'),
    validateTime('interviewSchedule', 'interviewTime'),
    verifyRole('employeer'),
    addInterviewScheduleController
);
    
interviewScheduleRouter.get('/applicantSchedules/:applicationId', validateParams(['applicationId']), authenticateUserCredentials, getScheduledInterviewsController);


export default interviewScheduleRouter;