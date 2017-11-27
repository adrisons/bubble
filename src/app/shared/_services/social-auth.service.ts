import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { CrudService } from 'app/shared/_services/crud.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { UserService } from 'app/user/user.service';
import { UserSession } from 'app/shared/_models/data';

declare const FB: any;
@Injectable()
export class SocialAuthService implements OnInit {

  private UserSession: UserSession;
  private apiEndPoint = '';

  constructor(private http: AuthHttp, private userService: UserService) {
    FB.init({
      appId: '129652787718722',
      status: false, // the SDK will attempt to get info about the current user immediately after init
      cookie: false, // enable cookies to allow the server to access the session
      xfbml: false, // With xfbml set to true, the SDK will parse your page's DOM to find and
      // initialize any social plugins that have been added using XFBML
      version: 'v2.8' // use graph api version 2.5
    });
  }

  ngOnInit(): void {
    this.apiEndPoint = '/social/auth';
    this.UserSession = this.userService.getProfile();
  }

  fbLogin() {
    return new Promise((resolve, reject) => {
      FB.login(result => {
        if (result.authResponse) {
          return this.http.post(this.apiEndPoint, { access_token: result.authResponse.accessToken })
            .toPromise()
            .then(response => {
              const token = response.headers.get('x-auth-token');
              if (token) {
                this.userService.addSocialNetwork('facebook', token);
              }
              resolve(response.json());
            })
            .catch(() => reject());
        } else {
          reject();
        }
      }, { scope: 'public_profile, email' });
    });
  }

  fbLogout() {
    return new Promise((resolve, reject) => { resolve(); });
  }

  logout() {
    localStorage.removeItem('id_token');
  }
}
