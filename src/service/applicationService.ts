import { User } from "../entities/user";
import { applyForJobRepo, getApplicationsForEmployeerRepo, getApplicationsOfCurrentUserRepo } from "../repository/applicationRepository";
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