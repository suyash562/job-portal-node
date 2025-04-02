import { User } from "../entities/user";
import { applyForJobRepo, getApplicantEmailAndPrimaryResumeRepo, getApplicationByIdRepo, getApplicationsForEmployeerRepo, getApplicationsOfCurrentUserRepo, updateUserApplicationStatusRepo } from "../repository/applicationRepository";
import { RequestResult } from "../types/types";


export const applyForJobService = async (user : User, jobId : number) => {
    try{
        return await applyForJobRepo(user, jobId);
    }
    catch(err){
        console.log(err);
        return  new RequestResult(500,'Internal Server Error',null);
    }
}

export const getApplicationsForEmployeerService = async (user : User) => {
    try{
        return await getApplicationsForEmployeerRepo(user);
    }
    catch(err){
        console.log(err);
        return  new RequestResult(500,'Internal Server Error',null);
    }
}

export const getApplicationsOfCurrentUserService = async (user : User) => {
    try{
        return await getApplicationsOfCurrentUserRepo(user);
    }
    catch(err){
        console.log(err);
        return  new RequestResult(500,'Internal Server Error',null);
    }
}

export const getApplicationByIdService = async (applicationId : number) => {
    try{
        return await getApplicationByIdRepo(applicationId);
    }
    catch(err){
        console.log(err);
        return  new RequestResult(500,'Internal Server Error',null);
    }
}

export const getApplicantEmailAndPrimaryResumeService = async (applicationId : number) => {
    try{
        return await getApplicantEmailAndPrimaryResumeRepo(applicationId);
    }
    catch(err){
        console.log(err);
        return  new RequestResult(500,'Internal Server Error',null);
    }
}

export const updateUserApplicationStatusService = async (applicationId : number, status : string) => {
    try{
        return await updateUserApplicationStatusRepo(applicationId, status);
    }
    catch(err){
        console.log(err);
        return  new RequestResult(500,'Internal Server Error',null);
    }
}