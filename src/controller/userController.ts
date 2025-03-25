import { Request, Response } from "express";
import { registerService } from "../service/userService";
import { User } from "../entities/user";
import { UserProfile } from "../entities/userProfile";


export const registerController = async (req : Request, res : Response) => {
    try{
        const {user} : {user : User & UserProfile}= req.body;
        const operationStatus = await registerService(user);
        if(operationStatus){
            res.sendStatus(201);
        }
        else{
            res.sendStatus(500);
        }
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}