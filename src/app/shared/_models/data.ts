/**
 * Modelo para un usuario
 */
export class User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  create_time: string;
  modify_time: string;
  social?: Social;
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

export interface Social {
  twitter?: string;
  facebook?: string;
}
