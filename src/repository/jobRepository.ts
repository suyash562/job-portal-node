import { AppDataSource } from "../config/database"
import { Job } from "../entities/job";
import { User } from "../entities/user"
import { RequestResult } from "../types/types";

export const addJobRepo = async (user : User, job : Job) => {
    try{
        const existingUser = await AppDataSource.getRepository(User).findOneBy({
            email : user.email
        })
        if(!existingUser){
            return  new RequestResult(401,'User not found',null);
        }
        job.employeer = existingUser;
        await AppDataSource.getRepository(Job).save(job);
        return new RequestResult(200,'success', true);
    }
    catch(err){
        console.log(err);
        return new RequestResult(500,'Internal Server Error', null);
    }
}

export const updateJobRepo = async (jobIdToUpdate : number, job : Job) => {
    try{
        const updateResult = await AppDataSource.getRepository(Job).update(jobIdToUpdate,job);
        return updateResult.affected != 0 ? new RequestResult( 200 ,'success', true) : new RequestResult( 404,'Not Found', false);
    }
    catch(err){
        console.log(err);
        return new RequestResult(500,'Internal Server Error', null);
    }
}

export const getEmployeerPostedJobsRepo = async (user : User) => {
    try{
        const jobs : Job[] = await AppDataSource.getRepository(Job)
        .createQueryBuilder("job")
        .select()
        .where({
            employeer : user.email
        })
        .getMany()

        return new RequestResult(200,'Success',jobs); 
    }
    catch(err){
        console.log(err);
        return new RequestResult(500,'Internal Server Error',null);
    }
}

export const getJobByIdRepo = async (jobId : number) => {
    try{
        const job : Job | null = await AppDataSource.getRepository(Job).findOneBy({
            id : jobId
        })

        return new RequestResult(job ? 200 : 404, job ? 'Success' : 'Not Found' ,job); 
    }
    catch(err){
        console.log(err);
        return new RequestResult(500,'Internal Server Error',null);
    }
}

export const getAllJobsRepo = async (page : number, limit : number) => {
    try{
        const jobs : Job[] = await AppDataSource.getRepository(Job)
        .createQueryBuilder("job")
        .leftJoinAndSelect("job.employeer","user")
        .leftJoinAndSelect("user.employeerCompany", "employeerCompany")
        .skip((page - 1)*limit)
        .take(limit)
        .getMany();

        return new RequestResult(200,'Success',jobs); 
    }
    catch(err){
        console.log(err);
        return new RequestResult(500,'Internal Server Error',null);
    }
}

export const deleteJobRepo = async (jobId : number) => {
    try{
        const jobs = await AppDataSource.getRepository(Job).delete(jobId);
        return new RequestResult(200, 'Success', true); 
    }
    catch(err){
        console.log(err);
        return new RequestResult(500,'Internal Server Error',null);
    }
}
