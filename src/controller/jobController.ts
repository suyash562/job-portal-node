import { NextFunction, Request, Response } from "express";
import { User } from "../entities/user";
import { RequestResult } from "../types/types";
import { Job } from "../entities/job";
import { addJobService, deleteJobService, getAllJobsService, getEmployeerPostedJobsService, getJobByIdService, updateJobService } from "../service/jobService";


export const addJobController = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const {user, job} : {user : User, job : Job} = req.body;
        const result : RequestResult = await addJobService(user, job);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        next(err);        
    }
}

export const updateJobController = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const {jobIdToUpdate, updatedJob} : {user : User, jobIdToUpdate : number, updatedJob : Job} = req.body;        
        const result : RequestResult = await updateJobService(jobIdToUpdate, updatedJob);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        next(err);
    }
}

export const getEmployeerPostedJobsController = async (req : Request, res : Response, next : NextFunction) => {
    try{
        
        const {user} : {user : User} = req.body;             
        const result : RequestResult = await getEmployeerPostedJobsService(user);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        next(err);
    }
}

export const deleteJobController = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const jobId = parseInt(req.params.jobId);        
        const result : RequestResult = await deleteJobService(jobId);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        next(err);
    }
}

export const getJobByIdController = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const {jobId} : {jobId : number} = req.body;        
        const result : RequestResult = await getJobByIdService(jobId);
        res.status(result.statusCode).send(result);
    }
    catch(err){       
        next(err);
    }
}

export const getAllJobsController = async (req : Request, res : Response, next : NextFunction) => {
    try{        
        const page : number = parseInt(req.query.page as string) || 1;
        const limit : number = parseInt(req.query.limit as string) || 5;  
        const company : string = req.query.company as string;
        const workMode : string = req.query.workMode as string;
        const employmentType : string = req.query.employmentType as string;
        const sort : string = req.query.sort as string;
              
        const filterOptions = {
            company : company === 'null' ? undefined : company,
            workMode : workMode === 'null' ? undefined : workMode,
            employmentType : employmentType === 'null' ? undefined : employmentType,
            sort : sort === 'null' ? undefined : sort
        }

        const result : RequestResult = await getAllJobsService(page, limit, filterOptions);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        next(err);
    }
}
