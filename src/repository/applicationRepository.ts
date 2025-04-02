import { UpdateResult } from "typeorm";
import { AppDataSource } from "../config/database"
import { Application } from "../entities/application";
import { Job } from "../entities/job";
import { User } from "../entities/user"
import { RequestResult } from "../types/types";

export const applyForJobRepo = async (user : User, jobId : number) => {
    try{
        const existingUser = await AppDataSource.getRepository(User).findOneBy({
            email : user.email
        })
        const existingJob = await AppDataSource.getRepository(Job).findOneBy({
            id : jobId
        })
        
        if(existingUser && existingJob){
            const newApplication : Application = new Application(new Date(),'Pending', existingUser, existingJob, true);
            await AppDataSource.getRepository(Application).save(newApplication);
            return new RequestResult(200, 'success', true);
        }
        return new RequestResult(404, 'Resource Not Found', null);
    }
    catch(err){
        console.log(err);
        return new RequestResult(500, 'Internal Server Error', null);
    }
}

export const getApplicationByIdRepo = async (applicationId : number) => {
    try{
        const application : Application | null= await AppDataSource.getRepository(Application)
        .createQueryBuilder('application')
        .leftJoinAndSelect("application.user", "user")
        .leftJoinAndSelect("user.profile", "profile")
        .where("application.id = :id", {id : applicationId})
        .getOne();

        if(application){
            return new RequestResult(200, 'Success', application);
        }
        
        return new RequestResult(404, 'Resource not found', null);
    }
    catch(err){
        console.log(err);
        return new RequestResult(500, 'Internal Server Error', null);
    }
}

export const getApplicantEmailAndPrimaryResumeRepo = async (applicationId : number) => {
    try{
        const application = await AppDataSource.getRepository(Application)
        .createQueryBuilder("application")
        .leftJoinAndSelect("application.user","user")
        .leftJoinAndSelect("user.profile","profile")
        .where("application.id = :id", {id : applicationId})
        .getOne();

        if(application){
            return new RequestResult(200, 'success', {email : application?.user.email, primaryResume : application.user.profile.primaryResume});
        }
        return new RequestResult(404, 'Resource not found', null);
    }
    catch(err){
        console.log(err);
        return new RequestResult(500, 'Internal Server Error', null);
    }
}

export const getApplicationsForEmployeerRepo = async (user : User) => {
    try{
        
        const applications = await AppDataSource.getRepository(Application).createQueryBuilder("application")
        .leftJoinAndSelect("application.user", "user")
        .leftJoinAndSelect("application.job","job")
        .leftJoinAndSelect("user.profile","profile")
        .where("job.employeer = :email", {email : user.email})
        .andWhere("application.isActive = :isActive", {isActive : 1})
        .getMany();
        
        return new RequestResult(200, 'success', applications);
    }
    catch(err){
        console.log(err);
        return new RequestResult(500, 'Internal Server Error', null);
    }
}

export const getApplicationsOfCurrentUserRepo = async (user : User) => {
    try{
        const applications = await AppDataSource.getRepository(Application).createQueryBuilder("application")
        .leftJoinAndSelect("application.job","job")
        .where("application.user = :email", {email : user.email})
        .getMany();

        return new RequestResult(200, 'success', applications);
    }
    catch(err){
        console.log(err);
        return new RequestResult(500, 'Internal Server Error', null);
    }
}

export const updateUserApplicationStatusRepo = async (applicationId : number, status : string) => {
    try{
        const updateResult : UpdateResult = await AppDataSource.getRepository(Application)
        .createQueryBuilder("application")
        .update({status : (status as 'Accepted' | 'Rejected')})
        .where({id : applicationId})
        .execute();

        if(updateResult.affected != 0 ){
            return new RequestResult(200, 'success', true);
        }
        return new RequestResult(404, 'Resource not found', false);
    }
    catch(err){
        console.log(err);
        return new RequestResult(500, 'Internal Server Error', null);
    }
}
