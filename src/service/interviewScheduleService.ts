import { Application } from "../entities/application";
import { InterviewSchedule } from "../entities/interviewSchedule";
import { addInterviewScheduleRepo, getScheduledInterviewsRepo } from "../repository/interviewScheduleRepository";
import { RequestResult } from "../types/types";
import { sendInterviewScheduledMail } from "./userService";
import { sendNotificationToActiveClient } from "./websocket";


export const addInterviewScheduleService = async (applicationId : number, interviewSchedule : InterviewSchedule) => {

    const notificationMessage : string = `An interview has been scheduled by the employeer on ${interviewSchedule.interviewDate} for your application with Id ${applicationId}`;
    const actionUrl : string = `/dashboard/component/userApplication/${applicationId}`;
    
    const requestResult : RequestResult = await addInterviewScheduleRepo(applicationId, interviewSchedule, notificationMessage, actionUrl);
    const application : Application = requestResult.value.application;
    
    sendNotificationToActiveClient(requestResult.value.application.user.email, requestResult.value.savedNotification);
    await sendInterviewScheduledMail(
        application.user.email,
        application.job.title,
        application.id.toString(),
        interviewSchedule.interviewDate.toString().split('T')[0],
        interviewSchedule.interviewTime.toString()
    );
    return requestResult;
}

export const getScheduledInterviewsService = async (applicationId : number) => {
    return await getScheduledInterviewsRepo(applicationId);
}
