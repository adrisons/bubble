// Strategy pattern
// This class acts like proxy between client and specific social network services

import { Injectable } from '@angular/core';
import { UserSocial, SocialType, User, LightUserSocial, Message } from 'app/shared/_models/data';
import { UserService } from 'app/user/user.service';
import { SocialAuthService } from 'app/shared/_services/social-auth.service';
import { AuthHttp } from 'angular2-jwt';
import { FacebookService } from 'app/shared/_services/facebook.service';
import { SocialServiceInterface } from 'app/shared/_interfaces/social-service.interface';
import { TwitterService } from 'app/shared/_services/twitter.service';
import { AlertService } from 'app/shared/_services/alert.service';
import { RequestOptions } from '@angular/http';


@Injectable()
export class SocialService {

  private apiEndPoint = '/social';

  constructor(private http: AuthHttp, private userService: UserService, private facebookService: FacebookService,
    private twitterService: TwitterService, private alertService: AlertService) {
  }

  login(social_name: String) {
    return this.getStrategy(social_name)
      .login(this.userService.getProfile().user.id.toString())

      // Save in session
      .then((userSocial: UserSocial) => this.getUserData({ user_id: userSocial.user_id }))
      .catch(error => {
        console.log('(login) error:' + error);
        this.alertService.error('Error logging in');
      });

  }

  // Get social data and save it to session
  getUserData(params): Promise<UserSocial> {
    console.log('(getuserData) params=' + JSON.stringify(params));
    return new Promise((resolve, reject) => {
      // Get user data
      const options = new RequestOptions({ params: params });
      this.http.get(this.apiEndPoint, options)
        .toPromise()
        .then(r => {
          const res = r.json();
          if (res.code === 200) {

            for (let i = 0; i < res.data.length; i++) {
              const social = res.data[i];
              const socialData: UserSocial = this.convertToUserSocial(res.data[i]);
              if (socialData !== null) {
                // Save in session
                this.userService.addSocialNetwork(socialData);
              }
            }
            resolve();
          } else {
            reject();
          }
        });
    });
  }



  // Remove the social network for the user
  remove(userSocial: UserSocial) {
    return new Promise((resolve, reject) => {
      return this.http.delete(this.apiEndPoint + '/' + userSocial.id)
        .toPromise()
        .then(res => {
          // Social network removed
          if (res.json().code === 200) {
            this.userService.removeSocialNetwork(userSocial);
            resolve();
          } else {
            reject();
          }
        })
        .catch(error => {
          console.log('(social logout) Error: ' + error);
          reject();
        });
    });
  }


  getTimeline(): Promise<{}> {
    return new Promise((resolve, reject) => {
      const social = this.userService.getUserSocial();
      const promises: Promise<{}>[] = [];
      Array.prototype.forEach.call(social, s => {
        promises.push(this.getStrategy(s.type.name)
          .getTimeline(s));
      });

      Promise.all(promises)
        .then((values: Message[][]) => {
          // Un array por cada red social
          // Hay que hacer un merge de el array of arrays para convertirlo a array
          const timeline = new Array<Message>();
          Array.prototype.forEach.call(values, array => {
            Array.prototype.forEach.call(array, a => {
              timeline.push(a);
            });
          });

          console.log('(getTimeline) timeline:' + timeline);
          resolve(timeline);
        });

    });

  }


  post(accounts: LightUserSocial[], m: Message, text: String): Promise<{}> {
    const callback = function (user) {
      this.alertService.success(user.login + ' posted!');
    };
    return this.forEachLightSocial(accounts, callback, 'post', m, text);
  }

  reply(accounts: LightUserSocial[], m: Message, text: String): Promise<{}> {
    // const callback = function (user) {
    //   this.alertService.success(user.login + ' replied!');
    // };
    // return this.forEachLightSocial(accounts, callback, 'reply', m);
    return null;
  }

  share(accounts: LightUserSocial[], m: Message, text: String): Promise<{}> {
    const callback = function (user) {
      this.alertService.success(user.login + ' shared!');
    };
    return this.forEachLightSocial(accounts, callback, 'share', m, text);
  }

  // =================
  // Private functions
  // =================

  // Gets the service for the particular social network (strategy pattern)
  private getStrategy(name: String): SocialServiceInterface {
    switch (name) {
      case 'facebook':
        return this.facebookService;
      case 'twitter':
        return this.twitterService;
      default:
        break;
    }
  }


  private forEachLightSocial(accounts: LightUserSocial[], callback: Function, func: string, ...args) {
    console.log('(foreachLightSocial) args:' + JSON.stringify(arguments));
    return new Promise((resolve, reject) => {
      if (!accounts || accounts.length === 0) {
        this.alertService.warn('Please select an account');
        reject();
      }

      // Get social information from selected accounts
      const social = this.userService.getUserSocial().filter((s: UserSocial) => {
        return accounts.find(a => {
          return a.bd_id === s.id;
        });
      });
      const promises: Promise<{}>[] = [];
      const scope = this;
      Array.prototype.forEach.call(social, function (s) {
        promises.push(scope.getStrategy(s.type.name)[func](s, ...args));
      });

      Promise.all(promises)
        .then((values) => {
          // Hay que hacer un merge de el array of arrays para convertirlo a array
          Array.prototype.forEach.call(values, user => {
            callback(user);
          });
          resolve(values);
        })
        .catch(err => reject(err));
    });
  }


  private convertToUserSocial(social): UserSocial {

    if (social.id) {
      const u: UserSocial = {
        id: social.id,
        social_id: social.social_id,
        user_id: social.user_id,
        login: social.login,
        access_token: social.access_token,
        type: {
          id: social.social_type_id,
          name: social.social_type_name
        }
      };
      return u;

    } else {
      console.log('(convertToUserSocial) Error: userSocial=' + social);
      return null;
    }

  }

}
