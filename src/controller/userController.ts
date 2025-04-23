import { NextFunction, Request, Response } from "express";
import { 
    approveEmployerRequestService,
    decreaseResumeCountAndUpdatePrimaryResumeService,  
    emailExistsService, 
    getAllVerifiedUsersForAdminService, 
    getNotVerifiedEmployersService, 
    getUserInfoForAdminService, 
    getUserProfileService, 
    getUserRoleService, 
    loginService,  
    registerService,  
    resetPasswordService, 
    sendOtpMail, 
    updatePrimaryResumeService, 
    updateResumeCountService,
    updateUserAccountStatusService,
    updateUserPasswordService, 
    updateUserProfileService,  
    verifyOtpService 
} from "../service/userService";
import { User } from "../entities/user";
import { UserProfile } from "../entities/userProfile";
import jwt from 'jsonwebtoken';
import { GlobalError, RequestResult } from "../types/types";
import fs from 'fs';
import { getTotalNumberOfJobsService } from "../service/jobService";
import { UserDTO } from "../dto/user.dto";
import { UserProfileDTO } from "../dto/userProfile.dto";
import { EmployeerCompanyDTO } from "../dto/company.dto";
import { ContactNumberDTO } from "../dto/contactNumbers.dto";
import { ContactNumber } from "../entities/contactNumber";


function renameFiles(email : string, deletedResumeNumber : number){
    
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

export const registerController = async (req : Request, res : Response, next : NextFunction) => {
    try{        
        const user : any = req.body;     
        
        const userDTO = new UserDTO(user.email, user.password, user.role);
        const userProfileDTO = new UserProfileDTO(user.firstName, user.lastName, user.address);
        const employerCompanyDTO = new EmployeerCompanyDTO(user.name, user.description, user.industry, user.companySize, user.website, user.location,);

        const contactNumbers = [new ContactNumber(user.contactNumber1)];
        user.contactNumber2 ? contactNumbers.push( new ContactNumber(user.contactNumber2)) : null;


        const result : RequestResult = await registerService(userDTO, userProfileDTO, employerCompanyDTO, contactNumbers);        
        res.status(result.statusCode).send(result); 
    }
    catch(err){
        next(err);
    }
}

export const verifyOtpController = async (req : Request, res : Response, next : NextFunction) => {
    try{     
        const {email, otp, passwordReset} = req.body;
        if(await verifyOtpService(email, otp, passwordReset)){ 
            res.status(200).send(true); 
        }
        else{
            throw new GlobalError(401, 'Incorrect OTP');
        }
    }
    catch(err){
        next(err);
    }
}

export const resendOtpController = async (req : Request, res : Response, next : NextFunction) => {
    try{     
        const {email, passwordReset} = req.body;
        emailExistsService(email);
        await sendOtpMail(email, passwordReset);
        res.status(200).send({message : 'OTP resent'});
    }
    catch(err){
        next(err);
    }
}


export const forgotPasswordController = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const userEmail : string = req.params['userEmail'];
        const result : RequestResult = await emailExistsService(userEmail);
        await sendOtpMail(userEmail, true);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        next(err);
    }
}


export const resetPasswordController = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const {email, password} : {email : string, password : string} = req.body;
        const result : RequestResult = await resetPasswordService(email, password);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        next(err);
    }
}


export const loginController = async function(req : Request, res : Response, next : NextFunction){
    const {user} = req.body;
    try{
        const result : RequestResult = await loginService(user);
        const userToken : string = jwt.sign({email : result.value.email, password : result.value.password, role : result.value.role}, process.env.KEY!, {expiresIn : "2h"});
        res.cookie("userToken" ,userToken, {maxAge : 1000*60*60, httpOnly : true, secure : true, sameSite : 'lax'});            
        res.status(200).send(result);
    }
    catch(err){
        next(err);
    }
}


export const logoutController = async (req : Request, res : Response, next : NextFunction) => {
    try{
        res.cookie('userToken', null, {maxAge : 0});
        res.status(200).send(true);
    }
    catch(err){
       next(err);
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


export const getNotVerifiedEmployersController = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const result : RequestResult = await getNotVerifiedEmployersService();
        res.status(result.statusCode).send(result);
    }
    catch(err){
        next(err);
    }
}


export const getUserRoleController = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const {user} = req.body;
        const result : RequestResult = await getUserRoleService(user);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        next(err);
    }
}


export const approveEmployerRequestController = async (req : Request, res : Response, next : NextFunction) => {
    try{
        const {user} = req.body;
        const employerEmail : string = req.params['employerEmail'];
        const result : RequestResult = await approveEmployerRequestService(employerEmail);
        res.status(result.statusCode).send(result);
    }
    catch(err){
        next(err);
    }
}


export const getResumeByIdController = async (req : Request, res : Response, next : NextFunction) => {
    try{         
        const {user, resumeNumber} : {user : User, resumeNumber : number} = req.body;    
        const resumeFile : Buffer = fs.readFileSync(`./public/documents/userResume/${user.email}/${resumeNumber}.pdf`);     
        res.contentType("application/pdf");
        res.send(resumeFile);
    }
    catch(err){
        next(err);
    }
}


export const uploadResumeController = async (req : Request, res : Response, next : NextFunction) => {
    const user : User = req.body;
    try{         
        const requestResult : RequestResult = await updateResumeCountService(user.email, 1);
        res.status(requestResult.statusCode).send(requestResult);
    }
    catch(err){
        const files = fs.readdirSync(`./public/documents/userResume/${user.email}`);
        const fileName = (files.length).toString();
        fs.unlinkSync(`./public/documents/userResume/${user.email}/${fileName}.pdf`);
        next(err);
    }
}


export const updatePrimaryResumeController = async (req : Request, res : Response, next : NextFunction) => {
    try{         
        const {user, resumeNumber} : {user : User, resumeNumber : number} = req.body;
        const requestResult : RequestResult = await updatePrimaryResumeService(user.email, resumeNumber);
        res.status(requestResult.statusCode).send(requestResult);
    }
    catch(err){
        next(err);
    }
}


export const deleteResumeController = async (req : Request, res : Response, next : NextFunction) => {
    try{         
        const {user, resumeNumber} : {user : User, resumeNumber : number} = req.body;
        const filePath = `./public/documents/userResume/${user.email}/${resumeNumber}.pdf`;

        if(fs.existsSync(filePath)){
            const requestResult = await decreaseResumeCountAndUpdatePrimaryResumeService(user.email);
            fs.unlinkSync(filePath);
            renameFiles(user.email, resumeNumber);
            res.status(requestResult.statusCode).send(requestResult);
        }
        else{
            throw new GlobalError(404, 'Resource not found');
        }
    }
    catch(err){
       next(err);
    }
}


export const updateUserProfileController = async (req : Request, res : Response, next : NextFunction) => {
    try{         
        const {userProfile, profileId} : {userProfile : Partial<UserProfile>, profileId : number} = req.body;
        const requestResult : RequestResult = await updateUserProfileService(userProfile, profileId);
        res.status(requestResult.statusCode).send(requestResult);
    }
    catch(err){
        next(err);
    }
}


export const updateUserPasswordController = async (req : Request, res : Response, next : NextFunction) => {
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
        next(err);
    }
}


export const getTotalNumberOfJobsController = async (req : Request, res : Response, next : NextFunction) => {
    try{         
        const requestResult : RequestResult = await getTotalNumberOfJobsService();
        res.status(requestResult.statusCode).send(requestResult);
    }
    catch(err){
        next(err);
    }
}


export const getAllRegisteredUsersForAdminController = async (req : Request, res : Response, next : NextFunction) => {
    try{         
        const requestResult : RequestResult = await getAllVerifiedUsersForAdminService();
        res.status(requestResult.statusCode).send(requestResult);
    }
    catch(err){
        next(err);
    }
}


export const updateUserAccountStatusController = async (req : Request, res : Response, next : NextFunction) => {
    try{         
        const email = req.params['email'];
        const status = req.params['status'];
        const requestResult : RequestResult = await updateUserAccountStatusService(email, status);
        res.status(requestResult.statusCode).send(requestResult);
    }
    catch(err){
        next(err);
    }
}


export const getUserInfoForAdminController = async (req : Request, res : Response, next : NextFunction) => {
    try{         
        const requestResult : RequestResult = await getUserInfoForAdminService();
        res.status(requestResult.statusCode).send(requestResult);
    }
    catch(err){
        next(err);
    }
}




// export const deleteUserIfNotVerifiedController = async (req : Request, res : Response, next : NextFunction) => {
//     try{     
//         const {email} = req.body;
//         await deleteNotVerifiedUserService(email);
//         removeSentOtpFromMap(email);
//         res.status(200).send(true);
//     }
//     catch(err){
//         next(err);
//     }
// }

