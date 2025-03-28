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
            const newApplication : Application = new Application(new Date(),'Pending', existingUser, existingJob);
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

export const getApplicationsForEmployeerRepo = async (user : User) => {
    try{
        
        const applications = await AppDataSource.getRepository(Application).createQueryBuilder("application")
        .leftJoinAndSelect("application.user", "user")
        .leftJoinAndSelect("application.job","job")
        .leftJoinAndSelect("user.profile","profile")
        .where("job.employeer = :email", {email : user.email})
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
