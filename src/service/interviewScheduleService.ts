import { InterviewSchedule } from "../entities/interviewSchedule";
import { addInterviewScheduleRepo, getScheduledInterviewsRepo } from "../repository/interviewScheduleRepository";
import { RequestResult } from "../types/types";


export const addInterviewScheduleService = async (applicationId : number, interviewSchedule : InterviewSchedule) => {
    try{
        return await addInterviewScheduleRepo(applicationId, interviewSchedule);
    }
    catch(err){
        console.log(err);
        return  new RequestResult(500,'Internal Server Error',null);
    }
}

export const getScheduledInterviewsService = async (applicationId : number) => {
    try{
        return await getScheduledInterviewsRepo(applicationId);
    }
    catch(err){
        console.log(err);
        return  new RequestResult(500,'Internal Server Error',null);
    }
}

