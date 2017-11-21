import { DataStoreService } from './data-store.service';
import { Injectable } from '@angular/core';
import { UserData } from '../_models/data';

@Injectable()
/**
 * Servicio especializado en guardar el estado del usuario
 * */
export class UserStoreService extends DataStoreService {

  constructor() {
    super('user-data', {
      isLogged: false,
      token: '',
      user: null,
    });
  }


  logIn(user, token) {
    super.setData({ user: user, token: token, isLogged: true });
  }

  logOut() {
    super.setData({ user: null, token: null, isLogged: false });
  }

  getProfile(): UserData {
    // To Do: refresh form API
    return super.getData();
  }

}
