import { AppDataSource } from "../config/database"
import { User } from "../entities/user"

export const registerRepo = async (user : User) => {
    try{
        const result = await AppDataSource.getRepository(User).save(user);
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}