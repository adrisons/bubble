/**
 * Modelo para un usuario
 */
export class User {
  id: number;
  first_name: String;
  last_name: String;
  email: String;
  create_date: String;
  update_date: String;
  social: UserSocial[] = [];
}

export class UserSession {
  isLogged?: boolean;
  token?: String;
  user?: User;
}
export interface DataSession {
  timeline?;
}

export class ServerResponseData {
  code: number;
  message?: String;
}

export interface LightUserSocial {
  bd_id?: String;
  type: SocialType;
  email?: String;
  login?: String;
  active?: Boolean;
}


export interface UserSocial {
  id?: String;
  social_id: String;
  user_id: String;
  type: SocialType;
  access_token: String;
  expires_at?: String;
  email?: String;
  login?: String;
  name?: String;
}
export interface SocialType {
  id: number;
  name: String;
}

export class Message {
  id: String;
  social_id: String;
  user: {
    id: String;
    name?: String;
    login?: String;
    img: String;
    url: String;
  };
  dateStr: String;
  date: Date;
  url: String;
  text: String;
  flags: {
    like: Boolean;
    like_count?: number;
    share: Boolean;
    share_count?: number;
    comment: Boolean;
    comment_count?: number;
  };
  socialType: SocialType;
  media: MessageMedia[];

}

export class MessageMedia {
  text: String;
  url: String; // link to the media
  src: String; // url for loading resource
  type: MessageType;
}

export class SocialAuthResult {
  'network_name': String;
  'access_token': String;
  'id_token': String;
  'expires_at': String;
}


export enum MessageType {
  photo = 0,
  video = 1,
  share = 2,
  text = 3
}
