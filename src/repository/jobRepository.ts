import { AppDataSource } from "../config/database"
import { Application } from "../entities/application";
import { Job } from "../entities/job";
import { User } from "../entities/user"
import { GlobalError, RequestResult } from "../types/types";

export const addJobRepo = async (user : User, job : Job) => {
    
    const existingUser = await AppDataSource.getRepository(User).findOneBy({
        email : user.email
    })
    if(existingUser){
        job.employeer = existingUser;
        await AppDataSource.getRepository(Job).save(job);
        return new RequestResult(200,'Job Post added successfully', true);
    }
    throw new GlobalError(404,'Failed to add job post');
}

export const updateJobRepo = async (jobIdToUpdate : number, job : Job) => {
    const updateResult = await AppDataSource.getRepository(Job).update(jobIdToUpdate,job);
    if(updateResult.affected != 0){
        return new RequestResult( 200 ,'Job post has been updated successfully', true)
    }
    throw new GlobalError(404, 'Failed to update job post');
}

export const getEmployeerPostedJobsRepo = async (user : User) => {
    
    const jobs : Job[] = await AppDataSource.getRepository(Job)
    .createQueryBuilder("job")
    .select()
    .where({
        employeer : user.email,
        isActive : 1
    })
    .getMany()

    return new RequestResult(200,'Success',jobs); 
}

export const getJobByIdRepo = async (jobId : number) => {
    
    const job : Job | null = await AppDataSource.getRepository(Job)
    .createQueryBuilder("job")
    .leftJoinAndSelect("job.employeer","user")
    .leftJoinAndSelect("user.employeerCompany", "employeerCompany")
    .where("job.id = :jobId", {jobId : jobId})
    .getOne();

    if(job){
        return new RequestResult(200 , 'Success', job); 
    }
    throw new GlobalError(404, 'Failed to get job post');
}

export const getAllJobsRepo = async (page : number, limit : number) => {

    const jobs : Job[] = await AppDataSource.getRepository(Job)
        .createQueryBuilder("job")
        .leftJoinAndSelect("job.employeer","user")
        .leftJoinAndSelect("user.employeerCompany", "employeerCompany")
        .where("job.deadlineForApplying >= :currentDate", {currentDate : (new Date().toISOString().split('T')[0])})
        .andWhere("job.isActive = :jobId", {jobId : 1})
        .skip((page - 1)*limit)
        .take(limit)
        .getMany();        
    
    return new RequestResult(200,'Success',jobs); 
}

export const deleteJobRepo = async (jobId : number) => {
    
        const updateJobIdResult = await AppDataSource.getRepository(Application)
        .createQueryBuilder("application")
        .leftJoinAndSelect("application.job", "job")
        .update({
            isActive : () => '0'
        })
        .where("job.id = :jobId", {jobId : jobId})
        .execute()
        
        const updateJobIdResult1 = await AppDataSource.getRepository(Job)
        .createQueryBuilder("job")
        .update({
            isActive : () => '0'
        })
        .where("id = :jobId", {jobId : jobId})
        .execute()

        return new RequestResult(200, 'Success', true); 
}

export const getTotalNumberOfJobsRepo = async () => {
    
    const jobs : Job[] = await AppDataSource.getRepository(Job)
        .createQueryBuilder("job")
        .where("job.deadlineForApplying >= :currentDate", {currentDate : (new Date().toISOString().split('T')[0])})
        .andWhere("job.isActive = :jobId", {jobId : 1})
        .getMany();
    

    return new RequestResult(200,'Success',jobs.length); 
}
