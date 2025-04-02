import { AppDataSource } from "../config/database"
import { User } from "../entities/user"
import { UserProfile } from "../entities/userProfile";
import { RequestResult } from "../types/types";

export const registerRepo = async (user : User) => {
    try{        
        await AppDataSource.getRepository(User).save(user);
        return new RequestResult(200, 'success', true);
    }
    catch(err){
        console.log(err);
        return new RequestResult(500, 'Internal Server Error', null);
    }
}

export const vefiryUserCredentials = async (user : Partial<User>) => {
    try{
        const result = await AppDataSource.getRepository(User).findOneBy({
            email : user.email,
            password : user.password
        });
        
        if(result){
            return new RequestResult(200, 'success', result);
        }
        return new RequestResult(401, 'Incorrect email or password', null);
    }
    catch(err : any){
        console.log(err.code);
        return new RequestResult(500, 'Internal Server Error', null);
    }
} 

export const getUserProfile = async (user : Partial<User>) => {
    try{
        const result = await AppDataSource.getRepository(UserProfile)
        .createQueryBuilder("userProfile")
        .leftJoinAndSelect("userProfile.user", "user")
        .where({
            user : user.email
        })
        .getOne();
        
        if(result){
            return new RequestResult(200, 'success', result);
        }
        return  new RequestResult(201, 'User Profile Not Found', null);
    }
    catch(err : any){
        console.log(err.code);
        return new RequestResult(500, 'Internal Server Error', null);
    }
} 

export const getUserRole = async (user : Partial<User>) => {
    try{
        const result = await AppDataSource.getRepository(User).findOneBy({
            email : user.email,
            password : user.password
        });
        
        if(result){
            return new RequestResult(200, 'success', result.role);
        }
        return new RequestResult(401, 'Unauthorized', null);
    }
    catch(err : any){
        console.log(err.code);
        return new RequestResult(500, 'Internal Server Error', null);
    }
} 

export const updateResumeCount = async (userEmail : string, count : number) => {
    try{
        const result = await AppDataSource.getRepository(UserProfile)
        .createQueryBuilder('userProfile')
        .leftJoinAndSelect('userProfile.user', 'user')
        .update({resumeCount : () => "resumeCount + :count"})
        .setParameters({count : count})
        .where("user.email = :email", {email : userEmail})
        .execute();
        
        const userProfile = await AppDataSource.getRepository(UserProfile)
        .createQueryBuilder('userProfile')
        .leftJoinAndSelect('userProfile.user', 'user')
        .where("user.email = :email", {email : userEmail})
        .getOne();

        if(userProfile?.primaryResume === 0){
            updatePrimaryResume(userEmail, 1);
        }

        if(result.affected != 0){
            return new RequestResult(200, 'success', true);
        }
        return new RequestResult(401, 'Resource not found', null);
    }
    catch(err : any){
        console.log(err);
        return new RequestResult(500, 'Internal Server Error', null);
    }
} 

export const updatePrimaryResume = async (userEmail : string, resumeNumber : number) => {
    try{
        const result = await AppDataSource.getRepository(UserProfile)
        .createQueryBuilder('userProfile')
        .leftJoinAndSelect('userProfile.user', 'user')
        .update({primaryResume : resumeNumber})
        .where("user.email = :email", {email : userEmail})
        .execute();
        
        if(result.affected != 0){
            return new RequestResult(200, 'success', true);
        }
        return new RequestResult(401, 'Resource not found', null);
    }
    catch(err : any){
        console.log(err);
        return new RequestResult(500, 'Internal Server Error', null);
    }
} 

export const decreaseResumeCountAndUpdatePrimaryResume = async (userEmail : string) => {
    try{
        const updateResumeCountResult = await updateResumeCount(userEmail, -1);

        const result = await AppDataSource.getRepository(UserProfile)
        .createQueryBuilder('userProfile')
        .leftJoinAndSelect('userProfile.user', 'user')
        .update({primaryResume : () => "resumeCount"})
        .where("user.email = :email", {email : userEmail})
        .andWhere("primaryResume > resumeCount")
        .execute();
    
        return new RequestResult(200, 'success', true);
    }
    catch(err : any){
        console.log(err);
        return new RequestResult(500, 'Internal Server Error', null);
    }
} 

export const updateUserProfile = async (userProfile : Partial<UserProfile>, profileId : number) => {
    try{
        userProfile.phoneNumber = userProfile.phoneNumber?.toString();
        const result = await AppDataSource.getRepository(UserProfile)
        .update({id : profileId}, userProfile);

        console.log(result);
        
    
        return new RequestResult(200, 'success', true);
    }
    catch(err : any){
        console.log(err);
        return new RequestResult(500, 'Internal Server Error', null);
    }
} 
