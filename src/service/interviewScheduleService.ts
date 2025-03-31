import { InterviewSchedule } from "../entities/interviewSchedule";
import { addInterviewScheduleRepo } from "../repository/interviewScheduleRepository";
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

