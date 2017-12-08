// Strategy pattern
// This class acts like proxy between client and specific social network services

import { Injectable } from '@angular/core';
import { UserSocial, SocialAuthResult } from 'app/shared/_models/data';
import { UserService } from 'app/user/user.service';
import { SocialAuthService } from 'app/shared/_services/social-auth.service';
import { AuthHttp } from 'angular2-jwt';

const apiEndPoint = '/social';
@Injectable()
export class SocialService {

  private userId = this.userService.getProfile().user.id;

  constructor(private http: AuthHttp, private userService: UserService) {
  }

  // Gets the service for the particular social network (strategy pattern)
  // private getStrategy(name: string): SocialServiceInterface {
  //   switch (name) {
  //     case 'facebook':
  //       return this.facebookService;
  //     case 'twitter':
  //       return this.twitterService;
  //     default:
  //       break;
  //   }
  // }


  // Register the social network for the user
  save(userSocial: UserSocial) {
    return new Promise((resolve, reject) => {
      // Save social network in BBDD
      return this.http.post(apiEndPoint, {
        user_id: this.userId, type_id: userSocial.type.id,
        access_token: userSocial.access_token, id_token: userSocial.id_token, login: userSocial.login
      })
        .toPromise()
        .then(r => {
          const res = r.json();
          if (res.code === 200) {
            userSocial.id = res.data.id;
            // Save in session
            this.userService.addSocialNetwork(userSocial);
            resolve();
          }
          reject();
        })
        .catch(error => {
          console.log('(social login) Error: ' + error);
          reject();
        });
    });
  }



  // Remove the social network for the user
  remove(userSocial: UserSocial) {
    return new Promise((resolve, reject) => {
      return this.http.delete(apiEndPoint + '/' + userSocial.id)
        .toPromise()
        .then(res => {
          // Social network removed
          if (res.json().code === 200) {
            this.userService.removeSocialNetwork(userSocial);
            resolve();
          }
          reject();
        })
        .catch(error => {
          console.log('(social logout) Error: ' + error);
          reject();
        });
    });
  }
}
