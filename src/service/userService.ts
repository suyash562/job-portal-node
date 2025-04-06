import { MailOptions } from "nodemailer/lib/json-transport";
import { EmployeerCompany } from "../entities/employeerCompany";
import { User } from "../entities/user";
import { UserProfile } from "../entities/userProfile";
import { decreaseResumeCountAndUpdatePrimaryResume, deleteNotVerifiedUser, getUserProfile, getUserRole, markUserAsVerified, registerRepo, updatePrimaryResume, updateResumeCount, updateUserPassword, updateUserProfile, vefiryUserCredentials } from "../repository/userRepository";
import bcrypt from 'bcrypt';
import { transporter } from "../config/mail";
import { applicationStatusUpdatedMailTemplate, interviewScheduledMailTemplate, otpMailTemplate } from "../templates/mailTemplates";
import { RequestResult } from "../types/types";

const sentOtpMap : Map<string, string> = new Map();
let deleteNotVerifiedUserTimeout : NodeJS.Timeout;

export const registerService = async (user : any) => {
    
    const newUser = new User(
        user.email,
        user.password,
        user.role,
        false
    );
    const newUserProfile = new UserProfile(
        user.firstName,
        user.lastName,
        user.phoneNumbers,
        user.address,
        user.role === 'employeer' ? -1 : 1,
        user.role === 'employeer' ? -1 : 1
    );
    const newEmployeerCompany = user.role === 'employeer' ? new EmployeerCompany(
        user.companyName,
        user.description,
        user.industry,
        user.companySize,
        user.website,
        user.location,
        0
    ) : null;

    newUser.profile = newUserProfile;
    if(newEmployeerCompany) newUser.employeerCompany = newEmployeerCompany;
    
    const registrationResult : RequestResult = await registerRepo(newUser);
    // await sendOtpMail(user.email);
    return registrationResult;
}


export const sendOtpMail = async (email : string) => {

    const otp : string = Math.random().toString().split('.')[1].slice(0,6);
    
    const mailOptions : MailOptions = {
        from: `SnapHire ${process.env.GMAIL_USER}`,
        to: email,
        subject: "OTP for Snap Hire",
        html : otpMailTemplate(otp),
    };
    await transporter.sendMail(mailOptions); 
    sentOtpMap.set(email, otp);
    setTimeoutForDeletingNotVerifiedUsers(email);

    return true; 
}

export const sendApplicationStatusResolvedMail = async (email : string, applicationId : string ,jobPost : string, appliedDate : string, applicationStatus : string) => {

    const mailOptions : MailOptions = {
        from: `SnapHire ${process.env.GMAIL_USER}`,
        to: email,
        subject: "Application accepted",
        html : applicationStatusUpdatedMailTemplate(applicationId, jobPost, appliedDate, applicationStatus),
    };
    await transporter.sendMail(mailOptions); 
    return true; 
}

export const sendInterviewScheduledMail = async (email : string, jobPost : string, applicationId : string, scheduleDate : string, scheduleTime : string) => {

    const mailOptions : MailOptions = {
        from: `SnapHire ${process.env.GMAIL_USER}`,
        to: email,
        subject: "Interview scheduled",
        html : interviewScheduledMailTemplate(jobPost, applicationId, scheduleDate, scheduleTime),
    };
    await transporter.sendMail(mailOptions); 
    return true; 
}

export const verifyOtpService = async (email : string, otp : string) => {
    if(sentOtpMap.get(email) === otp){
        clearTimeout(deleteNotVerifiedUserTimeout);
        await markUserAsVerifiedService(email);
        removeSentOtpFromMap(email);
        return true;
    }
    return false;
}

export const removeSentOtpFromMap = (email : string) => {
    sentOtpMap.delete(email);
}

export const setTimeoutForDeletingNotVerifiedUsers = (email : string) => {
    clearTimeout(deleteNotVerifiedUserTimeout);
    deleteNotVerifiedUserTimeout = setTimeout(async () => {
        if(sentOtpMap.has(email)){
            await deleteNotVerifiedUserService(email);
            removeSentOtpFromMap(email);
        }
    }, 1000 * 60 * 5);
}

export const markUserAsVerifiedService = async (email : string) => {
    return await markUserAsVerified(email);
}

export const deleteNotVerifiedUserService = async (email : string) => {
    return await deleteNotVerifiedUser(email);
}

export const generatePasswordHash = async (plainPassword : string) => {
    return await bcrypt.hash(plainPassword, 10);
}

export const comparePasswordWithHash = async (plainPassword : string, hashPassword : string) => {
    return await bcrypt.compare(plainPassword, hashPassword);
}

export const loginService = async (user : Partial<User>) => {
    return await vefiryUserCredentials(user);
}

export const getUserProfileService = async (user : Partial<User>) => {
    return await getUserProfile(user);
}

export const getUserRoleService = async (user : Partial<User>) => {
    return await getUserRole(user);
}

export const updateResumeCountService = async (email : string, count :number) => {
    return await updateResumeCount(email, count);
}

export const updatePrimaryResumeService = async (email : string, resumeNumber : number) => {
    return await updatePrimaryResume(email, resumeNumber);
}

export const decreaseResumeCountAndUpdatePrimaryResumeService = async (email : string) => {
    return await decreaseResumeCountAndUpdatePrimaryResume(email);
}

export const updateUserProfileService = async (userProfile : Partial<UserProfile>, profileId : number) => {
    return await updateUserProfile(userProfile, profileId);
}

export const updateUserPasswordService = async (email : string, currentPassword : string, newPassword : string) => {
    return await updateUserPassword(email, currentPassword, newPassword);
}