import { Injectable } from '@angular/core';
import { SocialServiceInterface } from 'app/shared/_interfaces/social-service.interface';
import { UserSocial, SocialType } from 'app/shared/_models/data';
import { AuthHttp } from 'angular2-jwt';
import { twitter_secret } from 'app/shared/_config/auth';

@Injectable()
export class TwitterService implements SocialServiceInterface {
  private apiEndPoint = '/social/tw';

  constructor(private http: AuthHttp) {

  }


  // login(userId: number) {
  //   return new Promise((resolve, reject) => {
  //     return this.http.post(this.apiEndPoint, { user_id: userId, access_token: 'test_twitter_access_token' })
  //       .toPromise()
  //       .then(res => {
  //         resolve(res.json());
  //       })
  //       .catch(() => reject());
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
