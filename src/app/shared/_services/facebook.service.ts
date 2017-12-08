import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { UserSocial } from 'app/shared/_models/data';
import { SocialServiceInterface } from 'app/shared/_interfaces/social-service.interface';
import { facebook_secret } from 'app/shared/_config/auth';
declare const FB: any;
const apiEndPoint = '/social/fb';

@Injectable()
export class FacebookService implements SocialServiceInterface {
  constructor(private http: AuthHttp) {
    FB.init({
      appId: facebook_secret.appId,
      status: false, // the SDK will attempt to get info about the current user immediately after init
      cookie: true, // enable cookies to allow the server to access the session
      xfbml: false, // With xfbml set to true, the SDK will parse your page's DOM to find and
      // initialize any social plugins that have been added using XFBML
      version: 'v2.8' // use graph api version 2.5
    });
    
  }


  login(userId: number) {
    return new Promise((resolve, reject) => {
      FB.login(result => {
        if (result.authResponse) {
          return this.http.post(apiEndPoint, { user_id: userId, access_token: result.authResponse.accessToken })
            .toPromise()
            .then(res => { resolve(res.json()); })
            .catch(() => reject());
        } else {
          reject();
        }
      }, { scope: 'public_profile, email' });
    });
  }


  logout(userId: number, token: string) {
    return new Promise((resolve, reject) => {
      return this.http.post(apiEndPoint + '/rm', { user_id: userId, access_token: token })
        .toPromise()
        .then(res => {
          resolve(res.json());
        })
        .catch(() => reject());
    });

  }


}
