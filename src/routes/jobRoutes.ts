import { Router } from "express";
import { addJobController, deleteJobController, getAllJobsController, getEmployeerPostedJobsController, getJobByIdController, updateJobController } from "../controller/jobController";
import { authenticateUserCredentials } from "../middleware/authenticate";
import { getTotalNumberOfJobsController } from "../controller/userController";
import { validate, validateDate, validateSalaryRange } from "../validators/validator";
import { jobSchema } from "../validators/validationSchema";
import { validateParams } from "../validators/paramsValidator";
import { verifyRole } from "../middleware/roleVerification";

export const jobRouter : Router = Router();
    
jobRouter.get('/jobs', getAllJobsController);
jobRouter.get('/totalActiveJobs', getTotalNumberOfJobsController);
jobRouter.get('/employeer', authenticateUserCredentials, verifyRole('employeer'), getEmployeerPostedJobsController);

jobRouter.post(
    '/addJob',
    authenticateUserCredentials,
    verifyRole('employeer'), 
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
    validateDate('job','deadlineForApplying'),
    validateDate('job','postingDate'),
    validateSalaryRange('job','salaryRange'),
    addJobController
);

jobRouter.delete('/deleteJob/:jobId', authenticateUserCredentials, verifyRole('employeer'), deleteJobController);

jobRouter.put('/updateJob', 
    authenticateUserCredentials,
    verifyRole('employeer'),
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
    ], jobSchema, 'updatedJob'), 
    validateDate('updatedJob','deadlineForApplying'),
    validateDate('updatedJob','postingDate'),
    validateSalaryRange('updatedJob','salaryRange'),
    updateJobController);



jobRouter.get('/:jobId', validateParams(['jobId']) , getJobByIdController);