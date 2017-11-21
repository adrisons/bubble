import { CrudService } from './../shared/_services/crud.service';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from './../shared/_models/data';
import { UserStoreService } from './../shared/_services/user-store.service';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';

@Injectable()
/**
 * CRUD con lógica específica apara usuarios y sesiones
 * */
export class UserService extends CrudService {

  constructor(private userStoreService: UserStoreService, http: Http) {
    super(http);
    this.apiEndPoint = this.apiEndPoint + '/user';
  }

  /**
   * Enviar credenciales y guardar token
   * */
  public login(credenciales) {
    return this.http
      .post(this.apiEndPoint + '/login', credenciales)
      .map(r => {
        const token = r.json();
        if (token.code === 200) {
          this.userStoreService.logIn(token.data, token);
        }
        return token;
      });
  }

  /**
   * Enviar credenciales y guardar token
   * */
  public register(credenciales) {
    return this.http
      .post(this.apiEndPoint + '/register', credenciales)
      .map(r => {
        const token = r.json();
        if (token.code === 200) {
          this.userStoreService.logIn(token.data, token);
        }
        return token;
      });
  }

  /**
   * Obtener el usuario actual
   * */
  public getProfile(): UserData {
    return this.userStoreService.getProfile();
  }

}
