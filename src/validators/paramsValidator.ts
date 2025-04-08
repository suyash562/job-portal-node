import { NextFunction, Request, Response } from "express";
import { GlobalError } from "../types/types";


export const validateParams = (paramsKey : string[]) => {
    
    return (req : Request, res : Response, next : NextFunction) => {    
        try{
            for(let key of paramsKey){
                let parsedNumber : number = parseInt(req.params[key]);
                if(!Number.isInteger(parsedNumber)){
                    throw new GlobalError(400, 'Bad request');
                }
                else{
                    req.body[key] = parsedNumber;
                }
            }
            next();
        }
        catch(err){
            next(err)
        }
    }
}