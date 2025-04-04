import { AppDataSource } from "../config/database"
import { Application } from "../entities/application";
import { InterviewSchedule } from "../entities/interviewSchedule";
import { GlobalError, RequestResult } from "../types/types";
import { updateUserApplicationStatusRepo } from "./applicationRepository";

export const addInterviewScheduleRepo = async (applicationId : number, interviewSchedule : InterviewSchedule) => {
        
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
        return new RequestResult(200, 'Interview scheduled successfully', true);
    }
    throw new GlobalError(404, 'Failed to add schedule');
}

export const getScheduledInterviewsRepo = async (applicationId : number) => {
   
    const scheduledInterviews =  await AppDataSource.getRepository(InterviewSchedule)
        .createQueryBuilder('interview')
        .select()
        .where("interview.userApplicationId = :applicationId", {applicationId : applicationId})
        .getMany();

    return new RequestResult(200, 'Success', scheduledInterviews);   
}
