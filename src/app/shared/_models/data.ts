/**
 * Modelo para un usuario
 */
export class UserData {
  user?: string;
  token?: string;
  isLogged?: boolean;
}

export class ServerResponseData {
  code: number;
  message?: string;
}
