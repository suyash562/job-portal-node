import { AppDataSource } from "../config/database"
import { Application } from "../entities/application";
import { InterviewSchedule } from "../entities/interviewSchedule";
import { Job } from "../entities/job";
import { GlobalError, RequestResult } from "../types/types";
import { updateUserApplicationStatusRepo } from "./applicationRepository";

const applicationRepository = AppDataSource.getRepository(Application);
const interviewScheduleRepository = AppDataSource.getRepository(InterviewSchedule);



export const addInterviewScheduleRepo = async (applicationId : number, interviewSchedule : InterviewSchedule, notificationMessage : string, actionUrl : string) => {
        
    let application : Application | null = await applicationRepository.findOne(
        {
            where : {
                id : applicationId,
            },
            relations : ['job', 'user']
        }
    );

    if(application){
        const newInterviewSchedule = new InterviewSchedule(
            interviewSchedule.interviewType,
            interviewSchedule.interviewDate,
            interviewSchedule.interviewTime,
            interviewSchedule.meetingUrl ?? '',
            interviewSchedule.address ?? '',
            interviewSchedule.instructions ?? ''
        ) 
        
        updateUserApplicationStatusRepo(applicationId, 'Interview', notificationMessage, actionUrl);
        
        newInterviewSchedule.userApplication = application;
        await AppDataSource.getRepository(InterviewSchedule).save(newInterviewSchedule);
        return new RequestResult(200, 'Interview scheduled successfully', {application : application});
    }
    throw new GlobalError(404, 'Failed to add schedule');

}

export const getScheduledInterviewsRepo = async (applicationId : number) => {
   
    const scheduledInterviews =  await interviewScheduleRepository
        .createQueryBuilder('interview')
        .select()
        .where("interview.userApplicationId = :applicationId", {applicationId : applicationId})
        .orderBy("interviewDate", 'DESC')
        .getMany();
    
    return new RequestResult(200, 'Success', scheduledInterviews);   

}
