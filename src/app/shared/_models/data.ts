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

export class UserSession implements Session {
  user?: User;
  token?: String;
  isLogged?: boolean;
}

export class ServerResponseData {
  code: number;
  message?: String;
}

export interface Session {
  isLogged?: boolean;
  token?: String;
  user?: User;
}

export interface UserSocial {
  social_id?: String;
  bd_id?: String;
  type: SocialType;
  access_token: String;
  expires_at: String;
  email?: String;
  login?: String;
}
export interface SocialType {
  id: number;
  name: String;
}

export class Message {
  bd_id: String;
  social_id: String;
  user: {
    id: String;
    name: String;
    img: String;
    url: String;
  };
  dateStr: String;
  date: Date;
  link: String;
  text: String;
  flags: {
    like: Boolean;
    share: Boolean;
    comment: Boolean;
  };
  socialType: SocialType;
  media: MessageMedia[];
  code?: String;
  type: MessageType;
}

export class MessageMedia {
  text: String;
  img: String;
  url: String;
  video: String;
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
