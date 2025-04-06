import { Application } from "../entities/application";
import { InterviewSchedule } from "../entities/interviewSchedule";
import { addInterviewScheduleRepo, getScheduledInterviewsRepo } from "../repository/interviewScheduleRepository";
import { RequestResult } from "../types/types";
import { sendInterviewScheduledMail } from "./userService";


export const addInterviewScheduleService = async (applicationId : number, interviewSchedule : InterviewSchedule) => {
    const requestResult : RequestResult = await addInterviewScheduleRepo(applicationId, interviewSchedule);
    const application : Application = requestResult.value.application;
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
