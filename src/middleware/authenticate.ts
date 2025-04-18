import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticateUserCredentials = async (req : Request, res : Response, next : NextFunction) => {
    try{
        
        const {userToken}  = req.cookies;
        if(userToken){
            const user = jwt.verify(userToken, process.env.KEY!);
            req.body.user = user;
            next();
        }
        else{            
            res.sendStatus(401);
        }
    }
    catch(err){
        res.sendStatus(401);
    }
}