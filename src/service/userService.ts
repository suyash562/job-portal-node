import { EmployeerCompany } from "../entities/employeerCompany";
import { User } from "../entities/user";
import { UserProfile } from "../entities/userProfile";
import { getUserProfile, getUserRole, registerRepo, vefiryUserCredentials } from "../repository/userRepository";
import { RequestResult } from "../types/types";


export const registerService = async (user : User & UserProfile, employeerCompany : EmployeerCompany) => {
    try{
        const newUser = new User(
            user.email,
            user.password,
            user.role
        );
        const newUserProfile = new UserProfile(
            user.firstName,
            user.lastName,
            user.phoneNumber,
            user.address,
            user.resume ?? ''
        );
        const newEmployeerCompany = employeerCompany ? new EmployeerCompany(
            employeerCompany.name,
            employeerCompany.description,
            employeerCompany.industry,
            employeerCompany.companySize,
            employeerCompany.website,
            employeerCompany.location,
            employeerCompany.averageRating
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