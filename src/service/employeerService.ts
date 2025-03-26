import { Job } from "../entities/job";
import { User } from "../entities/user";
import { addJobRepo, deleteJobRepo, getEmployeerPostedJobsRepo, getJobByIdRepo, updateJobRepo } from "../repository/employeerRepository";
import { RequestResult } from "../types/types";


export const addJobService = async (user : User, job : Job) => {
    try{
        return await addJobRepo(user, job);
    }
    catch(err){
        console.log(err);
        return  new RequestResult(500,'Internal Server Error',null);
    }
}

export const updateJobService = async (jobIdToUpdate : number, job : Job) => {
    try{
        return await updateJobRepo(jobIdToUpdate, job);
    }
    catch(err){
        console.log(err);
        return  new RequestResult(500,'Internal Server Error',null);
    }
}

export const getEmployeerPostedJobsService = async (user : User) => {
    try{
        return await getEmployeerPostedJobsRepo(user);
    }
    catch(err){
        console.log(err);
        return  new RequestResult(500,'Internal Server Error',null);;
    }
}

export const deleteJobService = async (jobId : number) => {
    try{
        return await deleteJobRepo(jobId);
    }
    catch(err){
        console.log(err);
        return  new RequestResult(500,'Internal Server Error',null);;
    }
}

export const getJobByIdService = async (jobId : number) => {
    try{
        return await getJobByIdRepo(jobId);
    }
    catch(err){
        console.log(err);
        return  new RequestResult(500,'Internal Server Error',null);;
    }
}
