import { NextFunction, Request, Response } from "express";
import { User } from "../entities/user";
import { GlobalError, RequestResult } from "../types/types";
import { 
    applyForJobService,  
    getApplicationByIdService, 
    getApplicationsForEmployeerService, 
    getApplicationsOfCurrentUserService, 
    updateUserApplicationStatusService 
} from "../service/applicationService";
import fs from 'fs';

export const applyForJobController = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const {user, jobId} : {user : User, jobId : number} = req.body;
        const result : RequestResult = await applyForJobService(user, jobId);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        next(err);
    }
}

export const getApplicationsForEmployeerController = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const {user} : {user : User} = req.body;
        const result : RequestResult = await getApplicationsForEmployeerService(user);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        next(err);
    }
}

export const getApplicationsOfCurrentUserController = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const {user} : {user : User} = req.body;        
        const result : RequestResult = await getApplicationsOfCurrentUserService(user);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        next(err);
    }
}

export const getApplicationByIdController = async (req : Request, res : Response, next : NextFunction) => {
    try{  
        const {applicationId} : {applicationId : number} = req.body;   
        const result : RequestResult = await getApplicationByIdService(applicationId);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        next(err);
    }
}

export const getResumeByApplicationIdController = async (req : Request, res : Response, next : NextFunction) => {
    try{         
        const {applicationId} : {applicationId : number} = req.body; 
        const resumeFile = fs.readFileSync(`./public/documents/applicationResume/${applicationId}.pdf`); 
        res.contentType("application/pdf");
        res.send(resumeFile);
    }
    catch(err){   
        next(err);
    }
}

export const updateUserApplicationStatusController = async (req : Request, res : Response, next : NextFunction) => {
    try{                 
        const status : string = req.params['applicationStatus'];    
        const applicationId : number = parseInt(req.params['applicationId'] as string);    
        if(!Number.isInteger(applicationId)){
            throw new GlobalError(400, 'Bad Request');
        }
        if(status){}
        const result : RequestResult = await updateUserApplicationStatusService(applicationId, status);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        next(err);
    }
}