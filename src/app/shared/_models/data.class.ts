/**
 * Modelo para un usuario
 */
export class UserData {
  user?: string;
  token?: string;
  isLogged?: boolean;
}

export class ServerResponse {
  code: number;
  message?: string;
}
