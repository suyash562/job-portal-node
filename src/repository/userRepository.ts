import { AppDataSource } from "../config/database"
import { ContactNumber } from "../entities/contactNumber";
import { User } from "../entities/user"
import { UserProfile } from "../entities/userProfile";
import { comparePasswordWithHash, generatePasswordHash } from "../service/userService";
import { GlobalError, RequestResult } from "../types/types";

const userProfileRepository = AppDataSource.getRepository(UserProfile);
const userRepository = AppDataSource.getRepository(User);
const contactNumberRepository = AppDataSource.getRepository(ContactNumber);


export const emailExistsRepo = async (userEmail : string) => {   
    const emailAlreadyExists = await userRepository.findOneBy(
        {
            email : userEmail,
        }
    );

    if(emailAlreadyExists){
        return new RequestResult(200, 'success', true);
    }
    throw new GlobalError(403, 'Email does not exist');
}


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
        throw new GlobalError(403, 'Make sure your contact number is valid');
    }

    
    user.password = await generatePasswordHash(user.password);
    await userRepository.save(user);
    return new RequestResult(200, 'success', true);
}


export const vefiryUserCredentials = async (user : Partial<User>) => {

    const result = await userRepository.findOne({
        where : {
            email : user.email,
            isVerifiedByAdmin : true
        }
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
        .leftJoinAndSelect("userProfile.contactNumbers", "contactNumbers")
        .where({
            user : user.email
        })
        .getOne();        
    
    if(result){
        return new RequestResult(200, 'success', result);
    }
    throw new GlobalError(404, 'Profile not found');

} 


export const getNotVerifiedEmployers = async () => {
    
    const result = await userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.employeerCompany", "employeerCompany")
        .leftJoinAndSelect("user.profile", "profile")
        .leftJoinAndSelect("profile.contactNumbers", "contactNumbers")
        .where({
            isVerifiedByAdmin : false
        })
        .andWhere({
            role : 'employeer'
        })
        .getMany();        
    
    if(result){
        return new RequestResult(200, 'success', result);
    }
    throw new GlobalError(404, 'Failed to get employeer details');
} 


export const getAllRegisteredUsersForAdmin = async () => {
    
    const result = await userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.profile", "profile")
        .leftJoinAndSelect("profile.contactNumbers", "contactNumbers")
        .where("role = :userRole or role = :employeerRole", {userRole : 'user', employeerRole : 'employeer'})
        .getMany();        
    
    if(result){
        return new RequestResult(200, 'success', result);
    }
    throw new GlobalError(404, 'Failed to get users');
} 


export const approveEmployerRequest = async (email : string) => {
    
    const result = await userRepository
        .createQueryBuilder("user")
        .update()
        .set({isVerifiedByAdmin : true})
        .where({
            email : email
        })
        .execute();        
    
    if(result.affected != 0){
        return new RequestResult(200, 'Employer request approved', result);
    }
    throw new GlobalError(404, 'Failed to approve employeer request');

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
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try{
        const contactNumbers = userProfile.contactNumbers!;
        userProfile.contactNumbers = undefined;

        const existingUserProfile = await queryRunner.manager
            .getRepository(UserProfile).findOneBy({
                id : profileId
            })
        
        if(!existingUserProfile){
            throw new GlobalError(403, 'Profile not found.');
        }

        // if(existingUserProfile.contactNumbers[0] !== contactNumbers[0]){  
        //     const contactNumberAlreadyExists = await contactNumberRepository.findOne({
        //         where : [
        //             {number : contactNumbers[0].number}, {number : contactNumbers[1]?.number}
        //         ]
        //     });
            
        //     if(contactNumberAlreadyExists){
        //         throw new GlobalError(403, 'Make sure your contact number is valid');
        //     }
        // }

        const result = await queryRunner.manager
            .getRepository(UserProfile)
            .update({id : profileId}, userProfile);

        // const updateContact1Result = await queryRunner.manager
        //     .getRepository(ContactNumber)
        //     .createQueryBuilder('contactNumber')
        //     .update()
        //     .set({number : contactNumbers![0].number})
        //     .where({number : existingUserProfile?.contactNumbers![0].number})
        //     .execute();
        
        // if(contactNumbers[1]){
        //     var updateContact2Result = await queryRunner.manager
        //         .getRepository(ContactNumber)
        //         .createQueryBuilder('contactNumber')
        //         .update()
        //         .set({number : contactNumbers[1].number})
        //         .where({number : existingUserProfile?.contactNumbers[1].number})
        //         .execute();
        // }
        
        userProfile.contactNumbers = contactNumbers;
       
        if(result.affected == 0){
            queryRunner.rollbackTransaction();
            throw new GlobalError(404, 'Failed to update profile');
        }
        // if(contactNumbers[1] && updateContact2Result!.affected == 0){
        //     queryRunner.rollbackTransaction();
        //     throw new GlobalError(404, 'Failed to update profile');
        // }
        queryRunner.commitTransaction();
        return new RequestResult(200, 'Profile has been updated', userProfile);
    }
    catch(err){
        await queryRunner.rollbackTransaction();
        throw(err);
    }
    finally{
        !queryRunner.isReleased ? await queryRunner.release() : null;
    }
} 


export const updateUserPassword = async (email : string, currentPassword : string, newPassword : string) => {
    
    const result = await userRepository.findOneBy({
        email : email
    });
    
    if(result && await comparePasswordWithHash(currentPassword!, result.password)){
        const result = await userRepository
        .update(
            {
                email : email,
            },
            {
                password : await generatePasswordHash(newPassword),
            }
        );
        
        if(result.affected != 0){   
            return new RequestResult(200, 'Password has been updated', true);
        }
    }     
    throw new GlobalError(401, 'Incorrect password');
} 


export const resetPassword = async (email : string, newPassword : string) => {
    
    const result = await userRepository
    .update(
        {
            email : email,
        },
        {
            password : await generatePasswordHash(newPassword),
        }
    );
    
    if(result.affected != 0){   
        return new RequestResult(200, 'Password reset', true);
    }
    throw new GlobalError(401, 'Failed to reset password');
} 


export const updateUserAccountStatus = async (email : string, status : string) => {
    
    const result = await userRepository
    .update(
        {
            email : email,
        },
        {
            isVerifiedByAdmin : status === 'Activate' ? true : false,
        }
    );
    
    if(result.affected != 0){   
        return new RequestResult(200, 'Account Status Updated', true);
    }
    throw new GlobalError(401, 'Failed to update status');
} 
