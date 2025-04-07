import { AppDataSource } from "../config/database"
import { ContactNumber } from "../entities/contactNumber";
import { User } from "../entities/user"
import { UserProfile } from "../entities/userProfile";
import { comparePasswordWithHash, generatePasswordHash } from "../service/userService";
import { GlobalError, RequestResult } from "../types/types";

const userProfileRepository = AppDataSource.getRepository(UserProfile);
const userRepository = AppDataSource.getRepository(User);
const contactNumberRepository = AppDataSource.getRepository(ContactNumber);


export const registerRepo = async (user : User) => {   
    const emailAlreadyExists = await userRepository.findOneBy(
        {
            email : user.email,
        }
    );

    if(emailAlreadyExists){
        throw new GlobalError(403, 'Email already exists. Try again with another email');
    }
    
    const contactNumberAlreadyExists = await contactNumberRepository.findOne({
        where : [{number : user.profile.contactNumbers[0].number}, {number : user.profile.contactNumbers[1]?.number}]
    })
    
    if(contactNumberAlreadyExists){
        throw new GlobalError(403, 'Contact number already exists.');
    }

    
    user.password = await generatePasswordHash(user.password);
    await userRepository.save(user);
    return new RequestResult(200, 'success', true);
}


export const vefiryUserCredentials = async (user : Partial<User>) => {

    const result = await userRepository.findOneBy({
        email : user.email
    });
    
    if(result && await comparePasswordWithHash(user.password!, result.password)){
        return new RequestResult(200, 'Logged In', result);
    }        
    throw new GlobalError(401, 'Incorrect email or password');

} 

export const markUserAsVerified = async (email : string) => {

    const result = await userRepository.update(
        {
            email : email
        },
        {
            isVerified : () => '1'
        }
    );
    
    if(result.affected != 0){
        return new RequestResult(200, 'success', true);
    }        
    throw new GlobalError(401, 'Failed to update user verification status');

} 

export const deleteNotVerifiedUser = async (email : string) => {

    const result = await userRepository.delete(
        {
            email : email
        }
    );
    
    if(result.affected != 0){
        return new RequestResult(200, 'success', true);
    }        
    throw new Error();
} 


export const getUserProfile = async (user : Partial<User>) => {
    
    const result = await userProfileRepository
        .createQueryBuilder("userProfile")
        .leftJoinAndSelect("userProfile.user", "user")
        .where({
            user : user.email
        })
        .getOne();        
    
    if(result){
        return new RequestResult(200, 'success', result);
    }
    throw new GlobalError(404, 'Profile not found');

} 


export const getUserRole = async (user : Partial<User>) => {

    const result = await userRepository.findOneBy({
        email : user.email,
        password : user.password
    });
    
    if(result){
        return new RequestResult(200, 'success', result.role);
    }
    throw new GlobalError(404, 'Profile not found');

} 


export const updateResumeCount = async (userEmail : string, count : number) => {

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try{
        const updateResumeCount = await queryRunner.manager
            .getRepository(UserProfile)
            .createQueryBuilder("userProfile")
            .leftJoinAndSelect('userProfile.user', 'user')
            .update(UserProfile)
            .set({resumeCount : () => "resumeCount + :count"})
            .setParameters({count : count})
            .where("user.email = :email", {email : userEmail})
            .execute();
            
        await queryRunner.manager
            .getRepository(UserProfile)
            .createQueryBuilder("userProfile")
            .leftJoinAndSelect('userProfile.user', 'user')
            .update(UserProfile)
            .set({primaryResume : 1})
            .where("user.email = :email", {email : userEmail})
            .andWhere("primaryResume = 0", {email : userEmail})
            .execute();

        if(updateResumeCount.affected === 0){
            throw new GlobalError(404, 'Failed to upload resume');
        }
        await queryRunner.commitTransaction();
        return new RequestResult(200, 'Resume uploaded', true);
    }
    catch(err){
        await queryRunner.rollbackTransaction();
        throw(err);
    }
    finally{
        !queryRunner.isReleased ? await queryRunner.release() : null;
    }

} 


export const updatePrimaryResume = async (userEmail : string, resumeNumber : number) => {
    
    const result = await userProfileRepository
        .createQueryBuilder('userProfile')
        .leftJoinAndSelect('userProfile.user', 'user')
        .update({primaryResume : resumeNumber})
        .where("user.email = :email", {email : userEmail})
        .execute();
    
    if(result.affected != 0){
        return new RequestResult(200, 'Primary resume updated', true);
    }
    throw new GlobalError(404, 'Failed to update primary resume');

} 


export const decreaseResumeCountAndUpdatePrimaryResume = async (userEmail : string) => {

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try{
        await updateResumeCount(userEmail, -1);

        await queryRunner.manager
            .getRepository(UserProfile)
            .createQueryBuilder('userProfile')
            .leftJoinAndSelect('userProfile.user', 'user')
            .update({primaryResume : () => "resumeCount"})
            .where("user.email = :email", {email : userEmail})
            .andWhere("primaryResume > resumeCount")
            .execute();

        await queryRunner.commitTransaction();
        return new RequestResult(200, 'Resume deleted', true);
    }
    catch(err){
        await queryRunner.rollbackTransaction();
        throw(err);
    }
    finally{
        !queryRunner.isReleased ? await queryRunner.release() : null;
    }

} 


export const updateUserProfile = async (userProfile : Partial<UserProfile>, profileId : number) => {
    
    // userProfile.phoneNumber = userProfile.phoneNumber?.toString();

    const result = await userProfileRepository.update({id : profileId}, userProfile);
        
    if(result.affected != 0){
        return new RequestResult(200, 'Profile has been updated', userProfile);
    }
    throw new GlobalError(404, 'Failed to update profile');
} 


export const updateUserPassword = async (email : string, currentPassword : string, newPassword : string) => {
    
    const result = await userRepository
        .update(
            {
                email : email,
                password : currentPassword
            },
            {
                password : newPassword
            }
        );
        
    if(result.affected != 0){   
        return new RequestResult(200, 'Password has been updated', true);
    }
    throw new GlobalError(401, 'Incorrect password');
} 
