import { Router } from "express";
import { addJobController, deleteJobController, getAllJobsController, getEmployeerPostedJobsController, getJobByIdController, updateJobController } from "../controller/jobController";
import { authenticateUserCredentials } from "../middleware/authenticate";
import { getTotalNumberOfJobsController } from "../controller/userController";

const jobRouter : Router = Router();
    
jobRouter.get('/jobs', getAllJobsController);
jobRouter.get('/totalActiveJobs', getTotalNumberOfJobsController);
jobRouter.get('/employeer', authenticateUserCredentials, getEmployeerPostedJobsController);
jobRouter.get('/:jobId', getJobByIdController);

jobRouter.post('/addJob', authenticateUserCredentials, addJobController);
jobRouter.delete('/deleteJob/:jobId', authenticateUserCredentials, deleteJobController);
jobRouter.put('/updateJob', authenticateUserCredentials, updateJobController);

export default jobRouter;