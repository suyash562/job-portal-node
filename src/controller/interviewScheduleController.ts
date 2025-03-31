import { Request, Response } from "express";
import { User } from "../entities/user";
import { InterviewSchedule } from "../entities/interviewSchedule";
import { RequestResult } from "../types/types";
import { addInterviewScheduleService } from "../service/interviewScheduleService";


export const addInterviewScheduleController = async (req : Request, res : Response) => {
    try{
        const {applicationId, interviewSchedule} : {user : User, applicationId : number, interviewSchedule : InterviewSchedule} = req.body;
        const result : RequestResult = await addInterviewScheduleService(applicationId, interviewSchedule);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error : "Internal Server Error"});
    }
}