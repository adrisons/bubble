import { CrudService } from './../shared/_services/crud.service';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserSession, User } from './../shared/_models/data';
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
  public login(credenciales: { email: string, password: string }): Observable<any> {
    return this.http
      .post(this.apiEndPoint + '/login', credenciales)
      .map(r => {
        const response = r.json();
        if (response.code === 200) {
          const token = response.data.token;
          this.userStoreService.logIn(response.data, token);
        }
        return response;
      })
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
  public register(user: User): Observable<any> {
    return this.http
      .post(this.apiEndPoint + '/register', user)
      .map(r => r.json())
      .catch(this.handleError);
  }

  /** Update */
  public update(user: User): Observable<any> {
    return this.http
      .put(this.apiEndPoint, user)
      .map(r => {
        const response = r.json();
        if (response.code === 200) {
          this.userStoreService.update(response.data);
        }
        return response;
      })
      .catch(this.handleError);
  };

  /**
   * Obtener el usuario actual
   * */
  public getProfile(): UserSession {
    return this.userStoreService.getProfile();
  }

  // Check form data to see if its correct
  // Return: Promise with error message
  public checkRegisterData(f: NgForm): Promise<string> {
    return new Promise((resolve, reject) => {
      if (f.valid) {
        const formData = f.form['_value'];
        if (formData['confirm-password'] && formData.password !== formData['confirm-password']) {
          reject('Passwords don\'t match!');
        }
        if (formData.password.length < 8) {
          reject('Password length must be > 8!');
        }
        resolve();
      } else {
        reject('Check the fields!');
      }
    });

  }


  public addSocialNetwork(name: string, token: string): UserSession {
    return this.userStoreService.addSocialNetwork(name, token);
  }

  // =================
  // PRIVATE FUNCTIONS
  // =================
  

  private handleError = (error: Response) => {
    this.alertService.error('Error ocurred contacting server');
    return Observable.throw(error);
  }

}
