// Strategy pattern
// This class acts like proxy between client and specific social network services

import { Injectable } from '@angular/core';
import { UserSocial, SocialAuthResult } from 'app/shared/_models/data';
import { UserService } from 'app/user/user.service';
import { SocialAuthService } from 'app/shared/_services/social-auth.service';
import { AuthHttp } from 'angular2-jwt';

const apiEndPoint = '/social/';
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
  save(auth_res: SocialAuthResult) {
    return new Promise((resolve, reject) => {
      // Save social network in BBDD
      return this.http.post(apiEndPoint, { user_id: this.userId, access_token: auth_res.access_token, id_token: auth_res.id_token })
        .toPromise()
        .then( r => {
          const res = r.json();
          if (res.code === 200) {
            const userSocial: UserSocial = res.data;
            if (userSocial !== null) {
              // Save in session
              this.userService.addSocialNetwork(userSocial);
              resolve();
            }
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
  // logout(type: SocialType, token: string) {
  //   return new Promise((resolve, reject) => {
  //     this.getStrategy(type).logout(this.userId, token)
  //       .then(res => {
  //         // Social network removed
  //         if (res.code === 200) {
  //           this.userService.removeSocialNetwork(type, token);
  //           resolve();
  //         }
  //         reject();
  //       })
  //       .catch(error => {
  //         console.log('(social logout) Error: ' + error);
  //         reject();
  //       });
  //   });
  // }
}
