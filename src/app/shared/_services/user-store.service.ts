import { DataStoreService } from './data-store.service';
import { Injectable } from '@angular/core';
import { UserData } from '../_models/data.class';

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


  public logIn(user, token) {
    super.setData({ user: user, token: token, isLogged: true });
  }
  public logOut(user, token) {
    super.setData({ user: null, token: null, isLogged: false });
  }

  public getProfile(): UserData {
    // To Do: refresh form API
    return super.getData();
  }
}
