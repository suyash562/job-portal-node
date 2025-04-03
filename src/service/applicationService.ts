import { User } from "../entities/user";
import { RequestResult } from "../types/types";
import fs from 'fs';
import { 
    applyForJobRepo,
    getApplicationByIdRepo,
    getApplicationsForEmployeerRepo,
    getApplicationsOfCurrentUserRepo,
    updateUserApplicationStatusRepo 
} from "../repository/applicationRepository";


export const applyForJobService = async (user : User, jobId : number) => {
    try{
        const result = await applyForJobRepo(user, jobId); 
        fs.copyFileSync(`./public/documents/userResume/${user.email}/${result.value.primaryResume}.pdf`, `./public/documents/applicationResume/${result.value.applicationId}.pdf`);
        return result;
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

export const updateUserApplicationStatusService = async (applicationId : number, status : string) => {
    try{
        return await updateUserApplicationStatusRepo(applicationId, status);
    }
    catch(err){
        console.log(err);
        return  new RequestResult(500,'Internal Server Error',null);
    }
}