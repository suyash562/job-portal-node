import { AppDataSource } from "../config/database"
import { Application } from "../entities/application";
import { Job } from "../entities/job";
import { User } from "../entities/user"
import { GlobalError, RequestResult } from "../types/types";


const jobRepository = AppDataSource.getRepository(Job);
const userRepository = AppDataSource.getRepository(User);


export const addJobRepo = async (user : User, job : Job) => {
    
    const existingUser = await userRepository.findOneBy({
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

    const updateResult = await jobRepository.update(jobIdToUpdate,job);
    if(updateResult.affected != 0){
        return new RequestResult( 200 ,'Job post has been updated successfully', true)
    }
    throw new GlobalError(404, 'Failed to update job post');

}

export const getEmployeerPostedJobsRepo = async (user : User) => {
    
    const jobs : Job[] = await jobRepository
        .createQueryBuilder("job")
        .leftJoinAndSelect("job.employeer", 'alias')
        .where("alias.isVerifiedByAdmin = 1")
        .andWhere("job.employeer = :email", {email : user.email})
        .andWhere("isActive = 1")
        .getMany();

    return new RequestResult(200,'Success',jobs); 

}

export const getJobByIdRepo = async (jobId : number) => {
    
    const job : Job | null = await jobRepository
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

    const jobs : Job[] = await jobRepository
        .createQueryBuilder("job")
        .leftJoinAndSelect("job.employeer","user")
        .leftJoinAndSelect("user.employeerCompany", "employeerCompany")
        .where("user.isVerifiedByAdmin = 1")
        .andWhere("job.deadlineForApplying >= :currentDate", {currentDate : (new Date().toISOString().split('T')[0])})
        .andWhere("job.isActive = :jobId", {jobId : 1})
        .skip((page - 1)*limit)
        .take(limit)
        .getMany();        
    
    return new RequestResult(200,'Success',jobs); 

}

export const deleteJobRepo = async (jobId : number) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try{

        const jobApplcationExists = await queryRunner.manager.getRepository(Application)
            .createQueryBuilder('application')
            .where('jobId = :jobId', {jobId : jobId})
            .getOne();

        const updateJobEntityResult = await queryRunner.manager
            .createQueryBuilder()
            .update(Job)
            .set({
                isActive : () => '0'
            })
            .where("id = :jobId", {jobId : jobId})
            .execute();
            
        if(jobApplcationExists){
            const updateApplicationEntityResult = await queryRunner.manager.createQueryBuilder()
            .update(Application)
            .set({
                isActive : () => '0'
            })
            .where("jobId = :jobId", {jobId : jobId})
            .execute();

            if(updateApplicationEntityResult.affected === 0 ){
                throw new GlobalError(404, 'Failed to delete job');
            }
        }

        if(updateJobEntityResult.affected === 0 ){
            throw new GlobalError(404, 'Failed to delete job');
        }

        await queryRunner.commitTransaction();
        return new RequestResult(200, 'Success', true); 
    }
    catch(err){
        await queryRunner.rollbackTransaction();
        throw(err);
    }
    finally{
        !queryRunner.isReleased ? await queryRunner.release() : null;
    }
}

export const getTotalNumberOfJobsRepo = async () => {
    
    const jobs : Job[] = await jobRepository
        .createQueryBuilder("job")
        .leftJoinAndSelect("job.employeer","employeer")
        .where("employeer.isVerifiedByAdmin = 1")
        .andWhere("job.deadlineForApplying >= :currentDate", {currentDate : (new Date().toISOString().split('T')[0])})
        .andWhere("job.isActive = :jobId", {jobId : 1})
        .getMany();
    

    return new RequestResult(200,'Success',jobs.length); 
    
}
