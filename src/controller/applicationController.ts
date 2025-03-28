import { Request, Response } from "express";
import { User } from "../entities/user";
import { RequestResult } from "../types/types";
import { applyForJobService, getApplicationsForEmployeerService, getApplicationsOfCurrentUserService } from "../service/applicationService";

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