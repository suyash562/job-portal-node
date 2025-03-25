import { User } from "../entities/user";
import { UserProfile } from "../entities/userProfile";
import { registerRepo, vefiryUserCredentials } from "../repository/userRepository";


export const registerService = async (user : User & UserProfile) => {
    try{
        const newUser = new User(user.email, user.password, user.role);
        const newUserProfile = new UserProfile(user.firstName, user.lastName, user.phoneNumber, user.address, user.resume ?? null);
        newUser.profile = newUserProfile;
        
        return await registerRepo(newUser);
    }
    catch(err){
        console.log(err);
        return {statusCode : 500, message : 'Internal Server Error'};
    }
}

export const loginService = async (user : Partial<User>) => {
    return await vefiryUserCredentials(user);
}