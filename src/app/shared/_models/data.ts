/**
 * Modelo para un usuario
 */
export class User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  create_date: string;
  update_date: string;
  social: UserSocial[] = [];
}

export class UserSession implements Session {
  user?: User;
  token?: string;
  isLogged?: boolean;
}

export class ServerResponseData {
  code: number;
  message?: string;
}

export interface Session {
  isLogged?: boolean;
  token?: string;
  user?: User;
}

export class UserSocial {
  type: SocialType;
  login?: string;
  email?: string;
  token: string;
}

export interface SocialType {
  id: number;
  name: string;
}
export class SocialAuthResult {
  'network_name': string;
  'access_token': string;
  'id_token': string;
  'expires_at': string;
}
