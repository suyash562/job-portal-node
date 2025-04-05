import { NextFunction, Request, Response } from "express";
import { GlobalError } from "../types/types";


export const globalErrorHandler = (err : Error, req : Request, res : Response, next : NextFunction) => {
    if(err instanceof GlobalError){
        res.status(err.statusCode).send(err.message);
    }
    else{
        res.status(500).send('Something went wrong');
    }
} 