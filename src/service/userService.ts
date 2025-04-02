import { EmployeerCompany } from "../entities/employeerCompany";
import { User } from "../entities/user";
import { UserProfile } from "../entities/userProfile";
import { decreaseResumeCountAndUpdatePrimaryResume, getUserProfile, getUserRole, registerRepo, updatePrimaryResume, updateResumeCount, vefiryUserCredentials } from "../repository/userRepository";
import { RequestResult } from "../types/types";


export const registerService = async (user : any) => {
    try{
        const newUser = new User(
            user.email,
            user.password,
            user.role
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
        
        return await registerRepo(newUser);
    }
    catch(err){
        console.log(err);
        return new RequestResult(500, 'Internal Server Error', null);
    }
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