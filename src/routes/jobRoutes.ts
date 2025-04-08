import { Router } from "express";
import { addJobController, deleteJobController, getAllJobsController, getEmployeerPostedJobsController, getJobByIdController, updateJobController } from "../controller/jobController";
import { authenticateUserCredentials } from "../middleware/authenticate";
import { getTotalNumberOfJobsController } from "../controller/userController";
import { validate, validateDate, validateSalaryRange } from "../validators/validator";
import { jobSchema } from "../validators/validationSchema";

export const jobRouter : Router = Router();
    
jobRouter.get('/jobs', getAllJobsController);
jobRouter.get('/totalActiveJobs', getTotalNumberOfJobsController);
jobRouter.get('/employeer', authenticateUserCredentials, getEmployeerPostedJobsController);
jobRouter.get('/:jobId', getJobByIdController);

jobRouter.post(
    '/addJob',
    validate([
        'title',
        'description',
        'requiredSkills',
        'vacancies',
        'preferredSkills',
        'employementType',
        'workMode',
        'facilities',
        'experienceLevel',
        'workLocation',
        'isActive'
    ], jobSchema, 'job'), 
    authenticateUserCredentials,
    validateDate('job','deadlineForApplying'),
    validateDate('job','postingDate'),
    validateSalaryRange('job','salaryRange'),
    addJobController
);

jobRouter.delete('/deleteJob/:jobId', authenticateUserCredentials, deleteJobController);
jobRouter.put('/updateJob', authenticateUserCredentials, updateJobController);
