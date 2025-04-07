import { AppDataSource } from "../config/database";
import { Notification } from "../entities/notification";
import { User } from "../entities/user";
import { RequestResult } from "../types/types";


const userRepository = AppDataSource.getRepository(User);


export const getNotificationsOfCurrentUserRepo = async (user : User) => {

    const getUser : User | null = await userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.notifications', 'notifications')
        .where('user.email = :email', {email : user.email})
        .getOne(); 
    
    if(getUser){
        getUser.notifications = getUser.notifications.sort((notification1, notification2) => {
            return notification2.id - notification1.id;
        });   
        return new RequestResult(200, 'success', {notifications : getUser.notifications, newNotificationsCount : getUser.newNotifications});
    }
    throw new Error();
}


export const markNotificationAsReadRepo = async (email : string, notificationId : number) => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try{
        const markNotificationAsRead = await queryRunner.manager.getRepository(Notification).update({id : notificationId}, {isRead : true});

        const decreaseNewNotificationsCount = await queryRunner.manager.getRepository(User).update(
            {
                email : email
            },
            {
                newNotifications : () => "newNotifications - 1" 
            }
        )

        if(markNotificationAsRead.affected != 0 && decreaseNewNotificationsCount.affected != 0){
            queryRunner.commitTransaction();
            return new RequestResult(200, 'success', true);
        }
        throw new Error();
    }
    catch(err){
        await queryRunner.rollbackTransaction();
        throw(err);
    }
    finally{
        !queryRunner.isReleased ? await queryRunner.release() : null;
    }
}
