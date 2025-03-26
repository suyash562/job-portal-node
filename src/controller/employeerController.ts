import { Request, Response } from "express";
import { User } from "../entities/user";
import { RequestResult } from "../types/types";
import { Job } from "../entities/job";
import { addJobService, deleteJobService, getEmployeerPostedJobsService, getJobByIdService, updateJobService } from "../service/employeerService";

export const addJobController = async (req : Request, res : Response) => {
    try{
        const {user, job} : {user : User, job : Job} = req.body;
        const result : RequestResult = await addJobService(user, job);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error : "Internal Server Error"});
    }
}

export const updateJobController = async (req : Request, res : Response) => {
    try{
        const {jobIdToUpdate, updatedJob} : {user : User, jobIdToUpdate : number, updatedJob : Job} = req.body;        
        const result : RequestResult = await updateJobService(jobIdToUpdate, updatedJob);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error : "Internal Server Error"});
    }
}

export const getEmployeerPostedJobsController = async (req : Request, res : Response) => {
    try{
        const {user} : {user : User} = req.body;
        const result : RequestResult = await getEmployeerPostedJobsService(user);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error : "Internal Server Error"});
    }
}

export const deleteJobController = async (req : Request, res : Response) => {
    try{
        const jobId = parseInt(req.params.jobId);        
        const result : RequestResult = await deleteJobService(jobId);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error : "Internal Server Error"});
    }
}

export const getJobByIdController = async (req : Request, res : Response) => {
    try{
        const jobId = parseInt(req.params.jobId);        
        const result : RequestResult = await getJobByIdService(jobId);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error : "Internal Server Error"});
    }
}
