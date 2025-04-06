import { AppDataSource } from "../config/database";
import { Notification } from "../entities/notification";
import { User } from "../entities/user";
import { RequestResult } from "../types/types";


const notificationRepository = AppDataSource.getRepository(Notification);


export const getNotificationsOfCurrentUserRepo = async (user : User) => {
    
    const userNotifications : Notification[] = await notificationRepository
        .createQueryBuilder('notification')
        .where('notification.user = :email', {email : user.email})
        .getMany();
    
    return new RequestResult(200, 'success', userNotifications);

}

export const markNotificationAsReadRepo = async (notificationId : number) => {
    
    const updateResult = await notificationRepository.update({id : notificationId}, {isRead : true});
    if(updateResult.affected != 0){
        return new RequestResult(200, 'success', true);
    }
    throw new Error();
}
