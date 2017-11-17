import { CrudService } from './../shared/crud.service';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from './../shared/model/data.class';
import { UserStoreService } from './../shared/user-store.service';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';

@Injectable()
/**
 * CRUD con lógica específica apara usuarios y sesiones
 * */
export class UserService extends CrudService {

  constructor(private userStoreService: UserStoreService, http: Http, private router: Router) {
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
        this.userStoreService.logIn({ email: credenciales.email }, token);
        this.router.navigate(['']);
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
        this.userStoreService.logIn({ email: credenciales.email }, token);
        this.router.navigate(['']);
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
