import { NextFunction, Request, Response } from "express"


export const verifyRole = (role : string) => {
    return (req : Request, res : Response, next : NextFunction) => {
        const {user} = req.body;
        
        if(user.role === role){
            next();
        }
        else{
            console.log(user);
            res.status(401).send('Unauthorized');
        }
    }
}