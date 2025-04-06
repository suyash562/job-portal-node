import { UpdateResult } from "typeorm";
import { AppDataSource } from "../config/database"
import { Application } from "../entities/application";
import { Job } from "../entities/job";
import { User } from "../entities/user"
import { GlobalError, RequestResult } from "../types/types";
import { Notification } from "../entities/notification";


const userRepository = AppDataSource.getRepository(User);
const applicationRepository = AppDataSource.getRepository(Application);



export const applyForJobRepo = async (user : User, jobId : number) => {
    
    const existingUser = await userRepository.findOne(
        {where : {email : user.email}, relations : ['profile']},
    )
    const existingJob = await AppDataSource.getRepository(Job).findOneBy({
        id : jobId
    })
    
    if(existingUser && existingJob){
        const newApplication : Application = new Application(new Date(),'Pending', existingUser, existingJob, true);
        const savedApplication : Application = await applicationRepository.save(newApplication);
        return new RequestResult(200, 'Applied to job successfully', {applicationId : savedApplication.id, primaryResume : existingUser.profile.primaryResume});
    }
    throw new GlobalError(404, 'Failed to apply for job');
    
}


export const getApplicationByIdRepo = async (applicationId : number) => {
    
    const application : Application | null= await applicationRepository
    .createQueryBuilder('application')
    .leftJoinAndSelect("application.user", "user")
    .leftJoinAndSelect("user.profile", "profile")
    .leftJoinAndSelect("application.job", "job")
    .where("application.id = :id", {id : applicationId})
    .getOne();

    if(application){
        return new RequestResult(200, 'Success', application);
    }
    
    throw new GlobalError(404, 'Failed to get application');
}


export const getApplicationsForEmployeerRepo = async (user : User) => {
    
    const applications = await applicationRepository
        .createQueryBuilder("application")
        .leftJoinAndSelect("application.user", "user")
        .leftJoinAndSelect("application.job","job")
        .leftJoinAndSelect("user.profile","profile")
        .where("job.employeer = :email", {email : user.email})
        .andWhere("application.isActive = :isActive", {isActive : 1})
        .getMany();
        
    return new RequestResult(200, 'success', applications);
}

export const getApplicationsOfCurrentUserRepo = async (user : User) => {
    
    const applications = await applicationRepository
        .createQueryBuilder("application")
        .leftJoinAndSelect("application.job","job")
        .where("application.user = :email", {email : user.email})
        .getMany();

    return new RequestResult(200, 'success', applications);

}


export const updateUserApplicationStatusRepo = async (applicationId : number, status : string, notificationMessage : string, actionUrl : string) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try{
        const updateResult : UpdateResult = await queryRunner.manager
            .getRepository(Application)
            .createQueryBuilder("application")
            .update({status : (status as 'Accepted' | 'Rejected')})
            .where({id : applicationId})
            .execute();
        
        const application : Application | null = await queryRunner.manager
            .getRepository(Application)
            .createQueryBuilder('application')
            .leftJoinAndSelect("application.job", "job")
            .leftJoinAndSelect("application.user", "user")
            .where("application.id = :applicationId", {applicationId : applicationId})
            .getOne(); 
        
        if( updateResult.affected == 0 || !application){
            throw new GlobalError(404, "Failed to update application status");
        }
        
        const newNotification : Notification = new Notification(notificationMessage, actionUrl, application.user, false);
        await queryRunner.manager.getRepository(Notification).save(newNotification);

        await queryRunner.commitTransaction();
        return new RequestResult(200, 'Application status updated', application);
    }
    catch(err){
        await queryRunner.rollbackTransaction();
        throw(err);
    }
    finally{
        !queryRunner.isReleased ? await queryRunner.release() : null;
    }
}
