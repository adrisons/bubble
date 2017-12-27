import { UserSocial, SocialType, Message } from 'app/shared/_models/data';


export interface SocialServiceInterface {
    login(user_id: String): Promise<UserSocial>;
    getTimeline(userSocial: UserSocial): Promise<Array<Message>>;
    post(userSocial: UserSocial, message: Message, text: String): Promise<UserSocial>;
    share(userSocial: UserSocial, message: Message, text: String): Promise<{}>;
    // reply(userSocial: UserSocial, message: Message, text: String): Promise<{}>;
}
