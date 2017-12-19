// Strategy pattern
// This class acts like proxy between client and specific social network services

import { Injectable } from '@angular/core';
import { UserSocial, SocialType, User } from 'app/shared/_models/data';
import { UserService } from 'app/user/user.service';
import { SocialAuthService } from 'app/shared/_services/social-auth.service';
import { AuthHttp } from 'angular2-jwt';
import { FacebookService } from 'app/shared/_services/facebook.service';
import { SocialServiceInterface } from 'app/shared/_interfaces/social-service.interface';
import { TwitterService } from 'app/shared/_services/twitter.service';


const apiEndPoint = '/social';
@Injectable()
export class SocialService {

  private user: User = this.userService.getProfile().user;

  constructor(private http: AuthHttp, private userService: UserService, private facebookService: FacebookService,
    private twitterService: TwitterService) {
  }


  // Gets the service for the particular social network (strategy pattern)
  private getStrategy(name: String): SocialServiceInterface {
    switch (name) {
      case 'facebook':
        return this.facebookService;
      // case 'twitter':
      // return this.twitterService;
      default:
        break;
    }
  }

  login(social_name: String): Promise<{}> {
    return this.getStrategy(social_name)
      .login()
      .then((userSocial: UserSocial) => this.save(userSocial));
  }

  // Register the social network for the user (BBDD and Session)
  save(userSocial: UserSocial): Promise<{}> {
    return new Promise((resolve, reject) => {
      // Save social network in BBDD
      return this.http.post(apiEndPoint, {
        user_id: this.user.id, type_id: userSocial.type.id,
        access_token: userSocial.access_token
      })
        .toPromise()
        .then(r => {
          const res = r.json();
          if (res.code === 200) {
            userSocial.bd_id = res.data.id;
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
      return this.http.delete(apiEndPoint + '/' + userSocial.bd_id)
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

  getFriends(socialType: string) {
    return this.getStrategy(socialType)
      .getFriends()
      .then(friends =>
        console.log(friends));
  }

  getTimeline(): Promise<{}> {
    return new Promise((resolve, reject) => {
      const social = this.userService.getProfile().user.social;
      // let promises = [];
      for (let i = 0; i < social.length; i++) {
        const s: UserSocial = social[i];
        resolve(this.getStrategy(s.type.name)
        .getTimeline(s.social_id, s.access_token));
        // promises.push(this.getStrategy(s.type.name)
        //   .getTimeline(s.social_id, s.access_token));
      }
      // Promise.all(promises)
      //   .then(values => {
      //     console.log('(getTimeline) values:' + values[0]);
      //     // TODO: Aquí pongo esto para las pruebas, pero hay que hacer un 
      //     // merge de el array of arrays para convertirlo a array
      //     const timeline = values[0].data;
      //     console.log('(getTimeline) timeline:' + timeline);
      //     resolve(timeline);
      //   });
        
        
        
    });

    // return new Promise((resolve, reject) => {
    //   const user = this.userService.getProfile().user;
    //   const promises = [];
    //   for (let i = 0; i < user.social.length; i++) {
    //     const s: UserSocial = user.social[i];
    //     promises.push(this.getStrategy(s.type.name).getTimeline(s.social_id));
    //   }

    //   Promise.all([promises]).then(timelines => {
    //     for (const timeline in timelines) {
    //       if (timeline !== null) {
    //         console.log('Timeline: ' + timeline);
    //         resolve(timeline);
    //       }
    //     }
    //   });

    // });
  }


}
