import { Router } from "express";
import { addJobController, deleteJobController, getEmployeerPostedJobsController, getJobByIdController, updateJobController } from "../controller/employeerController";
import { authenticateUserCredentials } from "../middleware/authenticate";

const employeerRouter : Router = Router();

employeerRouter.post('/addJob', authenticateUserCredentials, addJobController);
employeerRouter.get('/jobs', authenticateUserCredentials, getEmployeerPostedJobsController);
employeerRouter.delete('/deleteJob/:jobId', authenticateUserCredentials, deleteJobController);
employeerRouter.get('/job/:jobId', authenticateUserCredentials, getJobByIdController);
employeerRouter.put('/updateJob', authenticateUserCredentials, updateJobController);

export default employeerRouter;