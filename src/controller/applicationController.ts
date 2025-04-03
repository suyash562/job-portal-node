import { Request, Response } from "express";
import { User } from "../entities/user";
import { RequestResult } from "../types/types";
import { 
    applyForJobService,  
    getApplicationByIdService, 
    getApplicationsForEmployeerService, 
    getApplicationsOfCurrentUserService, 
    updateUserApplicationStatusService 
} from "../service/applicationService";
import fs from 'fs';

export const applyForJobController = async (req : Request, res : Response) => {
    try{
        const {user} : {user : User} = req.body;
        const jobId : number = parseInt(req.params['jobId'] as string);
        const result : RequestResult = await applyForJobService(user, jobId);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error : "Internal Server Error"});
    }
}

export const getApplicationsForEmployeerController = async (req : Request, res : Response) => {
    try{
        const {user} : {user : User} = req.body;
        const result : RequestResult = await getApplicationsForEmployeerService(user);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error : "Internal Server Error"});
    }
}

export const getApplicationsOfCurrentUserController = async (req : Request, res : Response) => {
    try{
        const {user} : {user : User} = req.body;        
        const result : RequestResult = await getApplicationsOfCurrentUserService(user);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error : "Internal Server Error"});
    }
}

export const getApplicationByIdController = async (req : Request, res : Response) => {
    try{  
        const applicationId : number = parseInt(req.params['applicationId'] as string);       
        const result : RequestResult = await getApplicationByIdService(applicationId);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error : "Internal Server Error"});
    }
}

export const getResumeByApplicationIdController = async (req : Request, res : Response) => {
    try{         
        const applicationId : number = parseInt(req.params['applicationId'] as string);    
        const resumeFile = fs.readFileSync(`./public/documents/applicationResume/${applicationId}.pdf`); 
        res.contentType("application/pdf");
        res.send(resumeFile);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error : "Internal Server Error"});
    }
}

export const updateUserApplicationStatusController = async (req : Request, res : Response) => {
    try{                 
        const status : string = req.params['applicationStatus'];    
        const applicationId : number = parseInt(req.params['applicationId'] as string);    
        const result : RequestResult = await updateUserApplicationStatusService(applicationId, status);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error : "Internal Server Error"});
    }
}