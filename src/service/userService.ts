import { EmployeerCompany } from "../entities/employeerCompany";
import { User } from "../entities/user";
import { UserProfile } from "../entities/userProfile";
import { decreaseResumeCountAndUpdatePrimaryResume, getUserProfile, getUserRole, registerRepo, updatePrimaryResume, updateResumeCount, updateUserPassword, updateUserProfile, vefiryUserCredentials } from "../repository/userRepository";
import { GlobalError } from "../types/types";


export const registerService = async (user : any) => {
    
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