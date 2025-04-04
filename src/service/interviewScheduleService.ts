import { InterviewSchedule } from "../entities/interviewSchedule";
import { addInterviewScheduleRepo, getScheduledInterviewsRepo } from "../repository/interviewScheduleRepository";


export const addInterviewScheduleService = async (applicationId : number, interviewSchedule : InterviewSchedule) => {
    return await addInterviewScheduleRepo(applicationId, interviewSchedule);
}

export const getScheduledInterviewsService = async (applicationId : number) => {
    return await getScheduledInterviewsRepo(applicationId);
}

