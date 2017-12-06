import { UserSocial, SocialType } from 'app/shared/_models/data';

export interface SocialServiceInterface {

    login(userId: number);
    logout(userId: number, token: string);
}
