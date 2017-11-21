/**
 * Modelo para un usuario
 */
export class User {
    first_name: string;
    last_name: string;
    email: string;
    create_time: string;
    modify_time: string;
}

export class UserData {
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
