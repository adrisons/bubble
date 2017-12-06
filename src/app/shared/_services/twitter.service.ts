import { Injectable } from '@angular/core';
import { SocialServiceInterface } from 'app/shared/_interfaces/social-service.interface';
import { UserSocial, SocialType } from 'app/shared/_models/data';
import { AuthHttp } from 'angular2-jwt';

const apiEndPoint = '/social/tw';

@Injectable()
export class TwitterService implements SocialServiceInterface {
  constructor(private http: AuthHttp) {

  }


  login(userId: number) {
    return new Promise((resolve, reject) => {
      return this.http.post(apiEndPoint, { user_id: userId, access_token: 'test_twitter_access_token' })
        .toPromise()
        .then(res => { 
          resolve(res.json()); 
        })
        .catch(() => reject());
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
