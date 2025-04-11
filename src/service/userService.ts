import { MailOptions } from "nodemailer/lib/json-transport";
import { EmployeerCompany } from "../entities/employeerCompany";
import { User } from "../entities/user";
import { UserProfile } from "../entities/userProfile";
import { approveEmployerRequest, decreaseResumeCountAndUpdatePrimaryResume, deleteNotVerifiedUser, emailExistsRepo, getAllRegisteredUsersForAdmin, getNotVerifiedEmployers, getUserInfoForAdmin, getUserProfile, getUserRole, markUserAsVerified, registerRepo, resetPassword, updatePrimaryResume, updateResumeCount, updateUserAccountStatus, updateUserPassword, updateUserProfile, vefiryUserCredentials } from "../repository/userRepository";
import bcrypt from 'bcrypt';
import { transporter } from "../config/mail";
import { applicationStatusUpdatedMailTemplate, employerAccountApprovedTemplate, interviewScheduledMailTemplate, otpMailTemplate } from "../templates/mailTemplates";
import { RequestResult } from "../types/types";
import { ContactNumber } from "../entities/contactNumber";
import { UserDTO } from "../dto/user.dto";
import { UserProfileDTO } from "../dto/userProfile.dto";
import { EmployeerCompanyDTO } from "../dto/company.dto";


const sentOtpMap : Map<string, string> = new Map();
const timeoutMap : Map<string, NodeJS.Timeout> = new Map();
let deleteNotVerifiedUserTimeout : NodeJS.Timeout;
let expireSentOtpFromMapTimeout : NodeJS.Timeout;

// async function d(){
//     console.log(await bcrypt.hash('admin@123', 10));
// }
// d()

export const registerService = async (userDTO : UserDTO, userProfileDTO : UserProfileDTO, employerCompanyDTO : EmployeerCompanyDTO ,contactNumbers : ContactNumber[]) => {
    
    
    const newUser = new User(
        userDTO.email,
        userDTO.password,
        userDTO.role,
        0,
        false,
        userDTO.role === 'user' ? true : false,
    );

    
    const newUserProfile = new UserProfile(
        userProfileDTO.firstName,
        userProfileDTO.lastName,
        userProfileDTO.address,
        userDTO.role === 'employeer' ? -1 : 1,
        userDTO.role === 'employeer' ? -1 : 1,
        contactNumbers
    );
    
    const newEmployerCompany = userDTO.role === 'employeer' ? new EmployeerCompany(
        employerCompanyDTO.name,
        employerCompanyDTO.description,
        employerCompanyDTO.industry,
        employerCompanyDTO.companySize,
        employerCompanyDTO.website,
        employerCompanyDTO.location,
        0
    ) : null;

    newUser.profile = newUserProfile;
    if(newEmployerCompany) newUser.employeerCompany = newEmployerCompany;
    
    const registrationResult : RequestResult = await registerRepo(newUser);
    await sendOtpMail(userDTO.email, false);
    return registrationResult;
}


export const sendOtpMail = async (email : string, passwordResetMail : boolean) => {

    const otp : string = Math.random().toString().split('.')[1].slice(0,6);
    
    const mailOptions : MailOptions = {
        from: `Snap Hire ${process.env.GMAIL_USER}`,
        to: email,
        subject: "OTP for Snap Hire",
        html : otpMailTemplate(otp),
    };
    await transporter.sendMail(mailOptions); 
    sentOtpMap.set(email, otp);
    expireSentOtpFromMap(email);
    if(!passwordResetMail){
        setTimeoutForDeletingNotVerifiedUsers(email);
    }

    return true; 
}

export const verifyOtpService = async (email : string, otp : string, passwordResetMail : boolean) => {
    
    if(sentOtpMap.get(email) === otp){
        if(!passwordResetMail){
            clearTimeout(timeoutMap.get(email));
            await markUserAsVerifiedService(email);
        }
        removeSentOtpFromMap(email);
        return true;
    }
    return false;
}

export const removeSentOtpFromMap = (email : string) => {
    sentOtpMap.delete(email);
}

export const expireSentOtpFromMap = (email : string) => {
    expireSentOtpFromMapTimeout = setTimeout(async () => {
        sentOtpMap.set(email , '');        
    }, 1000 * 60 * 3);
}

export const setTimeoutForDeletingNotVerifiedUsers = (email : string) => {
    clearTimeout(timeoutMap.get(email));
    deleteNotVerifiedUserTimeout = setTimeout(async () => {
        if(sentOtpMap.has(email)){
            await deleteNotVerifiedUserService(email);
            removeSentOtpFromMap(email);            
        }
    }, 1000 * 60 * 6);
    timeoutMap.set(email, deleteNotVerifiedUserTimeout);
}


export const sendApplicationStatusResolvedMail = async (email : string, applicationId : string ,jobPost : string, appliedDate : string, applicationStatus : string) => {

    const mailOptions : MailOptions = {
        from: `Snap Hire ${process.env.GMAIL_USER}`,
        to: email,
        subject: "Application accepted",
        html : applicationStatusUpdatedMailTemplate(applicationId, jobPost, appliedDate, applicationStatus),
    };
    await transporter.sendMail(mailOptions); 
    return true; 
}

export const sendInterviewScheduledMail = async (email : string, jobPost : string, applicationId : string, scheduleDate : string, scheduleTime : string) => {

    const mailOptions : MailOptions = {
        from: `Snap Hire ${process.env.GMAIL_USER}`,
        to: email,
        subject: "Interview scheduled",
        html : interviewScheduledMailTemplate(jobPost, applicationId, scheduleDate, scheduleTime),
    };
    await transporter.sendMail(mailOptions); 
    return true; 
}

export const sendEmployerRequestApprovedMail = async (email : string) => {

    const mailOptions : MailOptions = {
        from: `Snap Hire ${process.env.GMAIL_USER}`,
        to: email,
        subject: "Account Verified",
        html : employerAccountApprovedTemplate(),
    };
    await transporter.sendMail(mailOptions); 
    return true; 
}

export const markUserAsVerifiedService = async (email : string) => {
    return await markUserAsVerified(email);
}

export const getNotVerifiedEmployersService = async () => {
    return await getNotVerifiedEmployers();
}

export const emailExistsService = async (userEmail : string) => {
    return await emailExistsRepo(userEmail);
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

export const approveEmployerRequestService = async (email : string) => {
    const requestResult : RequestResult =  await approveEmployerRequest(email);
    await sendEmployerRequestApprovedMail(email);
    return requestResult;
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

export const resetPasswordService = async (email : string, newPassword : string) => {
    return await resetPassword(email, newPassword);
}

export const getAllVerifiedUsersForAdminService = async () => {
    return await getAllRegisteredUsersForAdmin();
}

export const updateUserAccountStatusService = async (email : string, status : string) => {
    return await updateUserAccountStatus(email, status);
}

export const getUserInfoForAdminService = async () => {
    return await getUserInfoForAdmin();
}