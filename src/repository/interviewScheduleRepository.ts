import { AppDataSource } from "../config/database"
import { Application } from "../entities/application";
import { InterviewSchedule } from "../entities/interviewSchedule";
import { RequestResult } from "../types/types";
import { updateUserApplicationStatusRepo } from "./applicationRepository";

export const addInterviewScheduleRepo = async (applicationId : number, interviewSchedule : InterviewSchedule) => {
    try{

        let application : Application | null = await AppDataSource.getRepository(Application).findOneBy({
            id : applicationId,
        })

        if(application){
            const newInterviewSchedule = new InterviewSchedule(
                interviewSchedule.interviewType,
                interviewSchedule.interviewDate,
                interviewSchedule.interviewTime,
                interviewSchedule.meetingUrl ?? '',
                interviewSchedule.address ?? '',
                interviewSchedule.instructions ?? ''
            ) 
            
            updateUserApplicationStatusRepo(applicationId, 'Interview');
            
            newInterviewSchedule.userApplication = application;
            await AppDataSource.getRepository(InterviewSchedule).save(newInterviewSchedule);
            return new RequestResult(200, 'Success', true);
        }
        return new RequestResult(404, 'Resource not found', false);
    }
    catch(err){
        console.log(err);
        return new RequestResult(500, 'Internal Server Error', null);
    }
}
