import { UpdateResult } from "typeorm";
import { AppDataSource } from "../config/database"
import { Application } from "../entities/application";
import { Job } from "../entities/job";
import { User } from "../entities/user"
import { GlobalError, RequestResult } from "../types/types";


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


export const updateUserApplicationStatusRepo = async (applicationId : number, status : string) => {
    const updateResult : UpdateResult = await applicationRepository
        .createQueryBuilder("application")
        .update({status : (status as 'Accepted' | 'Rejected')})
        .where({id : applicationId})
        .execute();
    
    if(updateResult.affected != 0 ){
        return new RequestResult(200, 'Application status updated', true);
    }
    throw new GlobalError(404, 'Failed to update application status');

}
