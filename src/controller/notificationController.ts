import { NextFunction, Request, Response } from "express";
import { User } from "../entities/user";
import { getNotificationsOfCurrentUserService, markNotificationAsReadService } from "../service/notificationService";
import { RequestResult } from "../types/types";


export const getNotificationsOfCurrentUserController = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const {user} : {user : User} = req.body;        
        const result : RequestResult = await getNotificationsOfCurrentUserService(user);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        next(err);
    }
}

export const markNotificationAsReadController = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const {notificationId} : {notificationId : number} = req.body;        
        const result : RequestResult = await markNotificationAsReadService(notificationId);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        next(err);
    }
}
