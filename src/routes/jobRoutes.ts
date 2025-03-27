import { Router } from "express";
import { addJobController, deleteJobController, getAllJobsController, getEmployeerPostedJobsController, getJobByIdController, updateJobController } from "../controller/jobController";
import { authenticateUserCredentials } from "../middleware/authenticate";

const jobRouter : Router = Router();
    
jobRouter.get('/jobs', getAllJobsController);
jobRouter.get('/:jobId', getJobByIdController);

jobRouter.post('/addJob', authenticateUserCredentials, addJobController);
jobRouter.get('/employeer', authenticateUserCredentials, getEmployeerPostedJobsController);
jobRouter.delete('/deleteJob/:jobId', authenticateUserCredentials, deleteJobController);
jobRouter.put('/updateJob', authenticateUserCredentials, updateJobController);

export default jobRouter;