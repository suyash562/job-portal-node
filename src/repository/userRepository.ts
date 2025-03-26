import { AppDataSource } from "../config/database"
import { User } from "../entities/user"
import { UserProfile } from "../entities/userProfile";

export const registerRepo = async (user : User) => {
    try{
        await AppDataSource.getRepository(User).save(user);
        return true;
    }
    catch(err){
        console.log(err);
        return {statusCode : 500, message : 'Internal Server Error'};
    }
}

export const vefiryUserCredentials = async (user : Partial<User>) => {
    try{
        const result = await AppDataSource.getRepository(User).findOneBy({
            email : user.email,
            password : user.password
        });
        
        if(result){
            return result;
        }
        return {statusCode : 401, message : 'Unauthorized'};
    }
    catch(err : any){
        console.log(err.code);
        return {statusCode : 500, message : 'Internal Server Error'};
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
            return result;
        }
        return {statusCode : 201, message : 'User Profile Not Found'};
    }
    catch(err : any){
        console.log(err.code);
        return {statusCode : 500, message : 'Internal Server Error'};
    }
} 

export const getUserRole = async (user : Partial<User>) => {
    try{
        const result = await AppDataSource.getRepository(User).findOneBy({
            email : user.email,
            password : user.password
        });
        
        if(result){
            return result.role;
        }
        return {statusCode : 401, message : 'Unauthorized'};
    }
    catch(err : any){
        console.log(err.code);
        return {statusCode : 500, message : 'Internal Server Error'};
    }
} 