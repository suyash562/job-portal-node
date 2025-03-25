import { Request, Response } from "express";
import { loginService, registerService } from "../service/userService";
import { User } from "../entities/user";
import { UserProfile } from "../entities/userProfile";
import { Errors } from "../types/types";
import jwt from 'jsonwebtoken';

export const registerController = async (req : Request, res : Response) => {
    try{
        const {user} : {user : User & UserProfile}= req.body;
        const result : boolean | Errors = await registerService(user);
        
        if(result === true){
            res.status(200).send(true);
        }
        else{
            res.status(result.statusCode).send({error : result.message});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send({error : "Internal Server Error"});
    }
}

export const loginController = async function(req : Request, res : Response){
    const {user} = req.body;
    try{
        const result : User | Errors = await loginService(user);
        if(result instanceof User){
            const userToken : string = jwt.sign({email : result.email, password : result.password}, process.env.KEY!, {expiresIn : "2h"});
            res.cookie("userToken" ,userToken, {maxAge : 1000*60*60, httpOnly : true, secure : true, sameSite : 'lax'});            
            res.status(200).send(true);
        }
        else{
            res.status(result.statusCode).send({error : result.message});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send({error : "Internal Server Error"});
    }
}


export const logoutController = async (req : Request, res : Response) => {
    try{
        const {userToken}  = req.cookies;
        if(userToken){
            res.cookie('userToken', null, {maxAge : 0});
            res.status(200).send(true);
        }
        else{
            res.status(401).send(false);
        }
    }
    catch(err){
        console.log(err);
        res.status(401).send(false);
    }
}


// export const isUserLoggedInController = async (req : Request, res : Response) => {
//     try{
//         const {userToken}  = req.cookies;
//         if(userToken){
//             jwt.verify(userToken, process.env.KEY!);
//             res.status(200).send(true);
//         }
//         else{
//             res.status(401).send(false);
//         }
//     }
//     catch(err){
//         console.log(err);
//         res.status(401).send(false);
//     }
// }