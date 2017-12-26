import { UserSocial, SocialType, Message } from 'app/shared/_models/data';


export interface SocialServiceInterface {
    login(user_id: String): Promise<{}>;
    getFriends();
    getTimeline(userSocial: UserSocial):  Promise<Array<Message>>;
    post(userSocial: UserSocial, message: String): Promise<UserSocial>;
}
