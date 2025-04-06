import { User } from "../entities/user";
import { GlobalError, RequestResult } from "../types/types";
import fs from 'fs';
import { 
    applyForJobRepo,
    getApplicationByIdRepo,
    getApplicationsForEmployeerRepo,
    getApplicationsOfCurrentUserRepo,
    updateUserApplicationStatusRepo 
} from "../repository/applicationRepository";
import { sendApplicationStatusResolvedMail } from "./userService";
import { Application } from "../entities/application";


export const applyForJobService = async (user : User, jobId : number) => {
    try{
        const result = await applyForJobRepo(user, jobId); 
        fs.copyFileSync(`./public/documents/userResume/${user.email}/${result.value.primaryResume}.pdf`, `./public/documents/applicationResume/${result.value.applicationId}.pdf`);
        return result;
    }
    catch(err){
        throw new GlobalError(404, 'Failed to apply for job');
    }
}

export const getApplicationsForEmployeerService = async (user : User) => {
    return await getApplicationsForEmployeerRepo(user);
}

export const getApplicationsOfCurrentUserService = async (user : User) => {
    return await getApplicationsOfCurrentUserRepo(user);
}

export const getApplicationByIdService = async (applicationId : number) => {
    return await getApplicationByIdRepo(applicationId);
}

export const updateUserApplicationStatusService = async (applicationId : number, status : string) => {
    const notificationMessage : string = `Your application for job post with application Id ${applicationId} has been ${status} by the employeer.`;
    const actionUrl : string = `/dashboard/component/userApplication/${applicationId}`;

    const requestResult : RequestResult = await updateUserApplicationStatusRepo(applicationId, status, notificationMessage, actionUrl);
    const application : Application = requestResult.value;
    await sendApplicationStatusResolvedMail(application.user.email, application.id.toString(), application.job.title, application.applyDate.toString().split('T')[0], application.status);
    return requestResult;
}