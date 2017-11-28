import { DataStoreService } from './data-store.service';
import { Injectable } from '@angular/core';
import { UserSession, User, Social, Session } from '../_models/data';

@Injectable()
/**
 * Servicio especializado en guardar el estado del usuario
 * */
export class UserStoreService extends DataStoreService {

  private session: Session;
  constructor() {
    super('user-data', {
      isLogged: false,
      token: '',
      user: null
    });
  }


  logIn(user: User, token: string) {
    super.setData({ user: user, token: token, isLogged: true });
  }

  update(user: User) {
    super.setData({ user: user, token: this.data.token, isLogged: this.data.isLogged });
  }

  logOut() {
    super.setData({ user: null, token: null, isLogged: false });
  }

  addSocialNetwork(name: string, token: string) {
    this.data.user.social.name = token;
    const session = { user: this.data.user, token: this.data.token, isLogged: this.data.isLogged };
    super.setData(session);
    return session;
  }

  getProfile(): UserSession {
    // To Do: refresh form API
    return super.getData();
  }

  isLoggedIn(): boolean {
    return this.data ? this.data.isLogged : false;
  }

}
