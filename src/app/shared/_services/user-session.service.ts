import { DataStoreService } from './data-store.service';
import { Injectable } from '@angular/core';
import { UserSession, User, UserSocial } from '../_models/data';

@Injectable()
/**
 * Servicio especializado en guardar el estado del usuario
 * */
export class UserSessionService extends DataStoreService {
  // this.data (from parent) is a Session type

  constructor() {
    const session: UserSession = {
      isLogged: false,
      token: '',
      user: null
    };
    super('user-data', session);
  }

  // Set the log in data in the session
  logIn(user: User, token: string) {
    super.setData({ user: user, token: token, isLogged: true });
  }

  // Update the user's session information
  update(user: User) {
    super.setData({ user: user, token: this.data.token, isLogged: this.data.isLogged });
  }

  // Delete the user's session information
  logOut() {
    super.setData({ user: null, token: null, isLogged: false });
  }

  // Add social network authentification to the user's social information
  addSocialNetwork(us: UserSocial): Promise<{}> {
    return new Promise((resolve, reject) => {
      const exist = this.data.user.social.find(s => (s.user_id === us.user_id
        && s.type.id === us.type.id
        && s.social_id === us.social_id));

      if (!exist) {
        this.data.user.social.push(us);
        const session = { user: this.data.user, token: this.data.token, isLogged: this.data.isLogged };
        super.setData(session);
        resolve();
      } else {
        resolve();
      }
    });
  }

  addSocialNextTimeline(us: UserSocial, next): Promise<{}> {
    return new Promise((resolve, reject) => {
      const exist = this.data.user.social.find(s => (s.user_id === us.user_id
        && s.type.id === us.type.id
        && s.social_id === us.social_id));

      if (exist) {
        exist['next'] = next;
        const session = { user: this.data.user, token: this.data.token, isLogged: this.data.isLogged };
        super.setData(session);
        resolve();
      } else {
        resolve();
      }
    });
  }

  // Delete the social network authentification from the user's social information
  removeSocialNetwork(us: UserSocial) {
    return new Promise((resolve, reject) => {
      const exist = this.data.user.social.find(s => (s.id === us.id));
      if (!exist) {
        reject('That account doesn\'t exist')
      } else {

        this.data.user.social = this.data.user.social.filter(s => (s.id !== us.id));
        const session = { user: this.data.user, token: this.data.token, isLogged: this.data.isLogged };
        super.setData(session);
        resolve();
      }
    });
  }


  getProfile(): UserSession {
    // To Do: refresh form API
    return super.getData();
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return this.data ? this.data.isLogged : false;
  }

}
