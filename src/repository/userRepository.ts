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
