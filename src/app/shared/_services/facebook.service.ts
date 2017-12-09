import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { UserSocial } from 'app/shared/_models/data';
import { SocialServiceInterface } from 'app/shared/_interfaces/social-service.interface';
import { facebook_secret } from 'app/shared/_config/auth';
declare const FB: any;

@Injectable()
export class FacebookService implements SocialServiceInterface {
  private apiEndPoint = '/social/fb';
  constructor(private http: AuthHttp) {
    FB.init(facebook_secret);

  }


  // login(userId: number) {
  //   return new Promise((resolve, reject) => {
  //     FB.login(result => {
  //       if (result.authResponse) {
  //         return this.http.post(this.apiEndPoint, { user_id: userId, access_token: result.authResponse.accessToken })
  //           .toPromise()
  //           .then(res => { resolve(res.json()); })
  //           .catch(() => reject());
  //       } else {
  //         reject();
  //       }
  //     }, { scope: 'public_profile, email' });
  //   });
  // }


  // logout(userId: number, token: string) {
  //   return new Promise((resolve, reject) => {
  //     return this.http.post(this.apiEndPoint + '/rm', { user_id: userId, access_token: token })
  //       .toPromise()
  //       .then(res => {
  //         resolve(res.json());
  //       })
  //       .catch(() => reject());
  //   });

  // }


}
