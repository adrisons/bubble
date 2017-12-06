// Strategy pattern
// This class acts like proxy between client and specific social network services

import { Injectable } from '@angular/core';
import { SocialType, UserSocial } from 'app/shared/_models/data';
import { SocialServiceInterface } from 'app/shared/_interfaces/social-service.interface';
import { FacebookService } from 'app/shared/_services/facebook.service';
import { TwitterService } from 'app/shared/_services/twitter.service';
import { UserService } from 'app/user/user.service';


@Injectable()
export class SocialService {

  private userId = this.userService.getProfile().user.id;

  constructor(private userService: UserService,
    private facebookService: FacebookService,
    private twitterService: TwitterService) {
  }

  // Gets the service for the particular social network (strategy pattern)
  private getStrategy(type: SocialType): SocialServiceInterface {
    switch (type.name) {
      case 'facebook':
        return this.facebookService;
      case 'twitter':
        return this.twitterService;
      default:
        break;
    }
  }

  // Register the social network for the user
  login(type: SocialType) {

    return new Promise((resolve, reject) => {
      this.getStrategy(type).login(this.userId)
        .then(res => {
          // Social network saved
          if (res.code === 200) {
            const userSocial: UserSocial = res.data;
            if (userSocial !== null) {
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
  logout(type: SocialType, token: string) {
    return new Promise((resolve, reject) => {
      this.getStrategy(type).logout(this.userId, token)
        .then(res => {
          // Social network removed
          if (res.code === 200) {
            this.userService.removeSocialNetwork(type, token);
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
