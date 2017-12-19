import { UserSocial, SocialType } from 'app/shared/_models/data';


export interface SocialServiceInterface {
    login(): Promise<{}>;
    getFriends();
    getTimeline(user_id, access_token): Promise<{}>;
}
