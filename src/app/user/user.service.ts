import { CrudService } from './../shared/_services/crud.service';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserData, User } from './../shared/_models/data';
import { UserStoreService } from './../shared/_services/user-store.service';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AlertService } from 'app/shared/_services/alert.service';

@Injectable()
/**
 * CRUD con lógica específica apara usuarios y sesiones
 * */
export class UserService extends CrudService {

  constructor(private userStoreService: UserStoreService, http: Http, private alertService: AlertService) {
    super(http);
    this.apiEndPoint = this.apiEndPoint + '/user';
  }


  /**
   * Logueo de usuarios. Enviar credenciales y guardar token
   * */
  public login(credenciales): Observable<any> {
    return this.http
      .post(this.apiEndPoint + '/login', credenciales)
      .map(this.mapResponseForLogin)
      .catch(this.handleError);
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
  public register(userData: User): Observable<any> {
    return this.http
      .post(this.apiEndPoint + '/register', userData)
      .map(this.mapResponseForLogin)
      .catch(this.handleError);
  }

  /** Update */
  public update(user: User): Observable<any> {
    return this.http
        .put(this.apiEndPoint, user)
        .map(this.mapResponseForLogin)
        .catch(this.handleError);
  };

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
        if (formData['confirm-password'] && formData.password !== formData['confirm-password']){
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

  // =================
  // PRIVATE FUNCTIONS
  // =================
  private mapResponseForLogin = r => {
    const token = r.json();
    if (token.code === 200) {
      this.userStoreService.logIn(token.data, token);
    }
    return token;
  }

  private handleError = (error: Response) => {
    this.alertService.error('Error ocurred contacting server');
    return Observable.throw(error);
  }

}
