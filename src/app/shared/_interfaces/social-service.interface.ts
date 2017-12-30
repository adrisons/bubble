import { UserSocial, SocialType, Message, UserPost } from 'app/shared/_models/data';


export interface SocialServiceInterface {
    login(user_id: String): Promise<UserSocial>;
    getTimeline(userSocial: UserSocial): Promise<Array<Message>>;
    post(userSocial: UserSocial, message: Message, post: UserPost): Promise<UserSocial>;
    share(userSocial: UserSocial, message: Message, post: UserPost): Promise<{}>;
    reply(userSocial: UserSocial, message: Message, post:UserPost): Promise<{}>;
    like(userSocial: UserSocial, message: Message, post:UserPost): Promise<{}>;
    unlike(userSocial: UserSocial, message: Message, post:UserPost): Promise<{}>;
}
