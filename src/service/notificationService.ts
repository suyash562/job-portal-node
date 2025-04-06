import { User } from "../entities/user";
import { getNotificationsOfCurrentUserRepo, markNotificationAsReadRepo } from "../repository/notificationRepository";




export const getNotificationsOfCurrentUserService = async (user : User) => {
    return await getNotificationsOfCurrentUserRepo(user);
}

export const markNotificationAsReadService = async (notificationId : number) => {
    return await markNotificationAsReadRepo(notificationId);
}
