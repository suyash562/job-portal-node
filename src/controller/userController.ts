import { NextFunction, Request, Response } from "express";
import { decreaseResumeCountAndUpdatePrimaryResumeService, getUserProfileService, getUserRoleService, loginService, registerService, updatePrimaryResumeService, updateResumeCountService, updateUserPasswordService, updateUserProfileService } from "../service/userService";
import { User } from "../entities/user";
import { UserProfile } from "../entities/userProfile";
import jwt from 'jsonwebtoken';
import { GlobalError, RequestResult } from "../types/types";
import fs from 'fs';
import { getTotalNumberOfJobsService } from "../service/jobService";


function renameFiles(email : string, deletedResumeNumber : number){
    try{
        const files = fs.readdirSync(`./public/documents/userResume/${email}`);
        if(files.length === 0){
            return;
        }
        else if(deletedResumeNumber === 2 && files.length === 2){
            fs.renameSync(`./public/documents/userResume/${email}/3.pdf`,`./public/documents/userResume/${email}/2.pdf`)
        }
        else if(deletedResumeNumber === 1 && files.length === 2){
            fs.renameSync(`./public/documents/userResume/${email}/3.pdf`,`./public/documents/userResume/${email}/1.pdf`)
        }
        else if(deletedResumeNumber === 1){
            fs.renameSync(`./public/documents/userResume/${email}/2.pdf`,`./public/documents/userResume/${email}/1.pdf`)
        }
    }
    catch(err){
        console.log(err);
    }
}

export const registerController = async (req : Request, res : Response) => {
    try{
        const user : User & UserProfile = req.body;       
        const result : RequestResult = await registerService(user);
        res.status(result.statusCode).send(result); 
    }
    catch(err){
        console.log(err);
        res.status(500).send({error : "Internal Server Error"});
    }
}

export const loginController = async function(req : Request, res : Response){
    const {user} = req.body;
    try{
        const result : RequestResult = await loginService(user);
        if(result.value){
            const userToken : string = jwt.sign({email : result.value.email, password : result.value.password}, process.env.KEY!, {expiresIn : "2h"});
            res.cookie("userToken" ,userToken, {maxAge : 1000*60*60, httpOnly : true, secure : true, sameSite : 'lax'});            
            res.status(200).send(result);
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
        // const {userToken}  = req.cookies;
        // if(userToken){
            res.cookie('userToken', null, {maxAge : 0});
            res.status(200).send(true);
        // }
        // else{
        //     res.status(401).send(false);
        // }
    }
    catch(err){
        console.log(err);
        res.status(500).send({error : "Internal Server Error"});
    }
}

export const getUserProfileController = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const {user} = req.body;
        const result : RequestResult = await getUserProfileService(user);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        next(err);
    }
}

export const getUserRoleController = async (req : Request, res : Response) => {
    try{
        const {user} = req.body;
        const result : RequestResult = await getUserRoleService(user);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error : "Internal Server Error"});
    }
}

export const getResumeByIdController = async (req : Request, res : Response) => {
    try{         
        const {user} : {user : User} = req.body;    
        const resumeNumber : number = parseInt(req.params['resumeNumber']);    
        const resumeFile = fs.readFileSync(`./public/documents/userResume/${user.email}/${resumeNumber}.pdf`);     
        res.contentType("application/pdf");
        res.send(resumeFile);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error : "Internal Server Error"});
    }
}

export const uploadResumeController = async (req : Request, res : Response) => {
    try{         
        const user : User = req.body;
        const requestResult : RequestResult = await updateResumeCountService(user.email, 1);
        res.status(requestResult.statusCode).send(requestResult);
    }
    catch(err){
        console.log(err);
        res.status(500).send({error : "Internal Server Error"});
    }
}

export const updatePrimaryResumeController = async (req : Request, res : Response) => {
    try{         
        const {user, resumeNumber} : {user : User, resumeNumber : number} = req.body;
        const requestResult : RequestResult = await updatePrimaryResumeService(user.email, resumeNumber);
        res.status(requestResult.statusCode).send(requestResult);
    }
    catch(err){
        res.status(500).send({error : "Internal Server Error"});
    }
}

export const deleteResumeController = async (req : Request, res : Response) => {
    try{         
        const {user, resumeNumber} : {user : User, resumeNumber : number} = req.body;
        const filePath = `./public/documents/userResume/${user.email}/${resumeNumber}.pdf`;

        if(fs.existsSync(filePath)){
            const decreaseResumeCountResult = await decreaseResumeCountAndUpdatePrimaryResumeService(user.email);
            if(decreaseResumeCountResult.value){
                fs.unlinkSync(filePath);
                renameFiles(user.email, resumeNumber);
                res.status(decreaseResumeCountResult.statusCode).send(decreaseResumeCountResult);
            }
            else{
                res.status(decreaseResumeCountResult.statusCode).send(decreaseResumeCountResult);
            }
        }
        else{
            res.status(404).send({error : 'Resource not found'});
        }
    }
    catch(err){
        res.status(500).send({error : "Internal Server Error"});
    }
}

export const updateUserProfileController = async (req : Request, res : Response) => {
    try{         
        const {userProfile, profileId} : {userProfile : Partial<UserProfile>, profileId : number} = req.body;
        const requestResult : RequestResult = await updateUserProfileService(userProfile, profileId);
        res.status(requestResult.statusCode).send(requestResult);
    }
    catch(err){
        res.status(500).send({error : "Internal Server Error"});
    }
}

export const updateUserPasswordController = async (req : Request, res : Response) => {
    try{         
        const {
            user,
            currentPassword,
            newPassword
        } : {
            user : User,
            currentPassword : string,
            newPassword : string
        } = req.body;

        const requestResult : RequestResult = await updateUserPasswordService(user.email, currentPassword, newPassword);
        res.status(requestResult.statusCode).send(requestResult);
    }
    catch(err){
        res.status(500).send({error : "Internal Server Error"});
    }
}

export const getTotalNumberOfJobsController = async (req : Request, res : Response) => {
    try{         
        const requestResult : RequestResult = await getTotalNumberOfJobsService();
        res.status(requestResult.statusCode).send(requestResult);
    }
    catch(err){
        res.status(500).send({error : "Internal Server Error"});
    }
}
