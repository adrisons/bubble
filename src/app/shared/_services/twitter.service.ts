import { Injectable } from '@angular/core';
import { SocialServiceInterface } from 'app/shared/_interfaces/social-service.interface';
import { UserSocial, SocialType, Message, MessageMedia, MessageType } from 'app/shared/_models/data';
import { AuthHttp } from 'angular2-jwt';
import { twitter_secret } from 'app/shared/_config/auth';
import { SocialService } from 'app/shared/_services/social.service';
import { RequestOptions } from '@angular/http';
import { TwitterMessage } from 'app/shared/_models/TwitterData';
import { AlertService } from 'app/shared/_services/alert.service';


@Injectable()
export class TwitterService implements SocialServiceInterface {


  private apiEndPoint = '/social/tw';
  private socialType = {
    id: 3,
    name: 'twitter'
  };
  constructor(private http: AuthHttp, private alertService: AlertService) {

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

  // Not used
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


  getTimeline(userSocial: UserSocial): Promise<Array<Message>> {
    return new Promise((resolve, reject) => {
      const options = new RequestOptions({ params: { access_token: userSocial.access_token, user_id: userSocial.user_id } });
      return this.http.get(this.apiEndPoint + '/timeline', options)
        .toPromise()
        .then(data => {
          const messages = [];
          const res = data.json();
          if (res.code === 200) {
            const requests = res.data.map((post) => {
              messages.push(this.toNemoMessage(post));
            });
            Promise.all(requests).then(() => {
              console.log('Got the user timeline', messages);
              resolve(messages);
            });
          } else {
            reject('(twitter-timeline): ' + res.code + ':' + res.message);
          }
        }).catch(error => {
          reject('(twitter-timeline):' + error);
        });
    });
  }

  post(userSocial: UserSocial, m: Message, text: String): Promise<UserSocial> {

    return new Promise((resolve, reject) => {
      return this.http.post(this.apiEndPoint,
        {
          'access_token': userSocial.access_token,
          'user_id': userSocial.user_id,
          'message': text
        }).toPromise()
        .then(r => {
          const res = r.json();
          console.log('(twitter-post) res:' + JSON.stringify(res));
          if (res.code === 200) {
            resolve(userSocial);
          } else {
            console.log('(twitter-post): ' + res.code + ':' + res.message);
            reject(userSocial);
          }
        }).catch(err => {
          console.log(err);
          reject(userSocial);
        });
    });
  }

  // Retweet
  share(userSocial: UserSocial, m: Message, text: String): Promise<{}> {
    return new Promise((resolve, reject) => {
      if (!this.isTwitterMessage(m)) {
        reject();
      } else {

        return this.http.post(this.apiEndPoint + '/retweet/' + m.social_id,
          {
            'access_token': userSocial.access_token,
            'user_id': userSocial.user_id,
            'message': text
          }).toPromise()
          .then(r => {
            const res = r.json();
            console.log('(twitter-retweet) res:' + JSON.stringify(res));
            if (res.code === 200) {
              resolve(userSocial);
            } else {
              console.log('(twitter-retweet): ' + res.code + ':' + res.message);
              reject(userSocial);
            }
          }).catch(err => {
            console.log(err);
            reject(userSocial);
          });
      }
    });
  }

  private isTwitterMessage(m: Message) {
    if (m.socialType.id !== this.socialType.id) {
      this.alertService.warn('Cannot publish ' + m.socialType.name + ' message in Twitter');
      return false;
    } else {
      return true;
    }

  }


  // Converter
  private toNemoMessage(msg: TwitterMessage): Message {
    const date = new Date(msg.created_at.toString());
    const media: MessageMedia[] = this.getMedia(msg);
    const nemoMsg: Message = {
      id: '',
      social_id: msg.id_str,
      media: media,
      dateStr: date.toLocaleString(),
      date: date,
      url: 'https://twitter.com/' + msg.user.screen_name + '/status/' + msg.id_str,
      text: msg.text,
      user: {
        id: msg.user.id_str,
        name: msg.user.name,
        login: msg.user.screen_name,
        img: msg.user.profile_image_url_https, // o profile_image_url
        url: 'https://twitter.com/' + msg.user.screen_name
      },
      flags: {
        like: msg.favorited,
        like_count: msg.favorite_count,
        share: msg.retweeted,
        share_count: msg.retweet_count,
        comment: false,
      },
      socialType: this.socialType
    };

    return nemoMsg;

  }


  private getMedia(msg: TwitterMessage): MessageMedia[] {
    const res: MessageMedia[] = [];
    if (msg.entities.media) {
      Array.prototype.forEach.call(msg.entities.media, m => {
        res.push(
          {
            text: m.display_url,
            url: m.expanded_url,
            src: m.media_url_https, // url for loading resource
            type: this.messageTypeConverter(m.type)
          });
      });
    }
    return res;
  }

  private messageTypeConverter(twitterType): MessageType {

    switch (twitterType) {

      case 'photo':
        return MessageType.photo;
      case 'video':
        return MessageType.video;
      default:
        return MessageType.text;

    }
  }

}
