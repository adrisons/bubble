import { UserSocial, SocialType } from 'app/shared/_models/data';


export interface SocialServiceInterface {
    login(user_id: String): Promise<{}>;
    getFriends();
    getTimeline(user_id, access_token): Promise<{}>;
    post(user_id: String, access_token: String, message: String);
}
