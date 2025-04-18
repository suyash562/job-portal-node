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
import { sendNotificationToActiveClient } from "./websocket";
import { Notification } from "../entities/notification";
import { saveNewNotification } from "../repository/notificationRepository";


export const applyForJobService = async (user : User, jobId : number) => {
    try{
        const result = await applyForJobRepo(user, jobId); 
        fs.copyFileSync(`./public/documents/userResume/${user.email}/${result.value.primaryResume}.pdf`, `./public/documents/applicationResume/${result.value.applicationId}.pdf`);
        
        const notificationMessage : string = `There is a new application with id ${result.value.applicationId} from user ${user.email}.`;
        const actionUrl : string = `dashboard/component/user/userApplication/${result.value.applicationId}`;

        const notification = new Notification(notificationMessage, actionUrl, result.value.employer, new Date(), false);
        const requestResult = await saveNewNotification(notification);
        sendNotificationToActiveClient(result.value.employer.email, requestResult.value.savedNotification);

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
    
    const notificationMessage : string = `Your application for job post with application Id ${applicationId} has been ${status} by the employer.`;
    const actionUrl : string = `/dashboard/component/user/userApplication/${applicationId}`;

    const requestResult : RequestResult = await updateUserApplicationStatusRepo(applicationId, status, notificationMessage, actionUrl);
    const application : Application = requestResult.value.application;
    await sendApplicationStatusResolvedMail(application.user.email, application.id.toString(), application.job.title, application.applyDate.toString().split('T')[0], application.status);
    sendNotificationToActiveClient(requestResult.value.application.user.email ,requestResult.value.savedNotification);
    
    return requestResult;
}