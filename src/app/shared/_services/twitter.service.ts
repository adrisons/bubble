import { Injectable } from '@angular/core';
import { SocialServiceInterface } from 'app/shared/_interfaces/social-service.interface';
import { UserSocial, SocialType } from 'app/shared/_models/data';
import { AuthHttp } from 'angular2-jwt';
import { twitter_secret } from 'app/shared/_config/auth';
import { SocialService } from 'app/shared/_services/social.service';
import { RequestOptions } from '@angular/http';


@Injectable()
export class TwitterService implements SocialServiceInterface {


  private apiEndPoint = '/social/tw';

  constructor(private http: AuthHttp) {

  }


  login(user_id: String): Promise<UserSocial> {
    return new Promise((resolve, reject) => {
      // We get the request token
      return this.http.get(this.apiEndPoint + '/request/' + user_id)
        .toPromise()
        .then(r => {
          const res = r.json();
          if (res.code === 200) {
            // Redirect to the auth url
            const _w = window.open(res.data.url);

            const parent_this = this;
            let interval_count = 0;
            const ref = window.setInterval(function () {
              interval_count++;
              if (interval_count > 3) {
                window.clearInterval(ref);
                _w.close();
                reject('Some error ocurred');
              }
              parent_this.getUserData({ user_id: user_id, request_token: res.data.request_token }).then((userData: UserSocial) => {
                if (userData && userData.access_token) {
                  window.clearInterval(ref);
                  _w.close();
                  console.log('userData:' + JSON.stringify(userData));
                  resolve(userData);
                }
              }).catch(error => {
                console.log('error:' + error);
                window.clearInterval(ref);
                _w.close();
                reject('Some error ocurred');
              });
            }, 5000);

          } else {
            reject();
          }
        })
        .catch(error => {
          console.log('(twitter-login):' + error);
          reject();
        });

    });
  }

  getUserData(params): Promise<UserSocial> {
    return new Promise((resolve, reject) => {
      const options = new RequestOptions({ params: params });
      return this.http.get(this.apiEndPoint + '/user-data', options)
        .toPromise()
        .then(data => {
          const res = data.json();
          if (res.code === 200) {
            resolve(res.data[0]);
          } else {
            reject('(getUserData): ' + res.code + ':' + res.message);
          }
        }).catch(error => {
          reject('(getUserData):' + error);
        });
    });
  }

  logout(userId: number, token: string) {
    return new Promise((resolve, reject) => {
      //     return this.http.post(this.apiEndPoint + '/rm', { user_id: userId, access_token: token })
      //       .toPromise()
      //       .then(res => {
      //         resolve(res.json());
      //       })
      //       .catch(() => reject());
      reject();
    });
  }

  getFriends() {
    throw new Error('Method not implemented.');
  }
  getTimeline(user_id: any, access_token: any): Promise<{}> {
    throw new Error('Method not implemented.');
  }

  post(user_id: String, access_token: String, message: String) {
    throw new Error('Method not implemented.');
  }
}
