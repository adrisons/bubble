import { CrudService } from './../shared/_services/crud.service';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from './../shared/_models/data';
import { UserStoreService } from './../shared/_services/user-store.service';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { NgForm } from '@angular/forms';

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
   * Logueo de usuarios. Enviar credenciales y guardar token
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
   * Deslogueo de usuarios.
   * */
  public logOut() {
    this.userStoreService.logOut();
  }

  /**
   * Registro usuario. Enviar datos y hacer login
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

    // Check form data to see if its correct
  // Return: Promise with error message
  public checkRegisterData(f: NgForm): Promise<string> {
    return new Promise((resolve, reject) => {
      if (f.valid) {
        const formData = f.form['_value'];
        if (formData.password !== formData['confirm-password']){
          reject('Passwords don\'t match!');
        }
        if (formData.password.length < 8) {
          reject('Password length must be > 8!');
        }
        resolve();
      } else {
        reject('Check the fields!');
      }
    } );

  }

}
