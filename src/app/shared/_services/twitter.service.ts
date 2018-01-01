import { Injectable } from '@angular/core';
import { SocialServiceInterface } from 'app/shared/_interfaces/social-service.interface';
import { UserSocial, SocialType, Message, MessageMedia, MessageType, UserPost } from 'app/shared/_models/data';
import { AuthHttp } from 'angular2-jwt';
import { twitter_secret } from 'app/shared/_config/auth';
import { SocialService } from 'app/shared/_services/social.service';
import { RequestOptions, ResponseContentType } from '@angular/http';
import { TwitterMessage } from 'app/shared/_models/TwitterData';
import { AlertService } from 'app/shared/_services/alert.service';
import { UserService } from 'app/user/user.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class TwitterService implements SocialServiceInterface {


  private apiEndPoint = '/social/tw';
  private socialType = {
    id: 3,
    name: 'twitter'
  };
  constructor(private http: AuthHttp, private alertService: AlertService, private userService: UserService) {

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

  private getMinId(messages: Message[]): String {
    if (messages.length > 0) {
      return messages.reduce((min, m) => Number(m.social_id) < min ? Number(m.social_id) : min, Number(messages[0].social_id)).toString();
    } else {
      return '';
    }
  }

  callGetTimeline(userSocial: UserSocial, params, resolve, reject) {
    return this.http.get(this.apiEndPoint + '/timeline', params)
      .toPromise()
      .then(data => {
        const messages: Message[] = [];
        const res = data.json();
        if (res.code === 200) {
          const requests = res.data.map((post) => {
            messages.push(this.toNemoMessage(post, userSocial));
          });
          Promise.all(requests).then(() => {
            console.log('Got the user timeline', messages);
            // Add the next page to the session
            this.userService.addSocialNextTimeline(userSocial, this.getMinId(messages));

            resolve(messages);
          });
        } else {
          reject('(twitter-timeline): ' + res.code + ':' + res.message);
        }
      }).catch(error => {
        reject('(twitter-timeline):' + error);
      });
  }

  getTimeline(userSocial: UserSocial): Promise<Array<Message>> {
    return new Promise((resolve, reject) => {
      const params = new RequestOptions({ params: { access_token: userSocial.access_token, user_id: userSocial.user_id } });
      this.callGetTimeline(userSocial, params, resolve, reject);
    });
  }

  getNextTimeline(userSocial: UserSocial): Promise<Array<Message>> {
    return new Promise((resolve, reject) => {
      if (userSocial.next) {
        const params = new RequestOptions({ params: { access_token: userSocial.access_token, user_id: userSocial.user_id, max_id: userSocial.next } });
        this.callGetTimeline(userSocial, params, resolve, reject);
      } else {
        reject('Twitter can not fetch more messages. No link');
      }
    });
  }
  private postPost(userSocial: UserSocial, params, resolve, reject) {
    this.http.post(this.apiEndPoint, params).toPromise()
      .then(r => {
        const res = r.json();
        console.log('(twitter-post) res:' + JSON.stringify(res));
        if (res.code === 200) {
          resolve(userSocial);
        } else {
          console.log('(twitter-post): ' + res.code + ':' + res.message);
          reject(res.message);
        }
      }).catch(err => {
        console.log('(twitter-post): ' + err.code + ':' + err.message);
        reject(err.message);
      });
  }
  // in_reply_to_status_id: This parameter will be ignored unless the author of the
  // Tweet this parameter references is mentioned within the status text. Therefore,
  // you must include @username , where username is the author of the referenced Tweet,
  // within the update.
  post(userSocial: UserSocial, m: Message, post: UserPost): Promise<UserSocial> {
    return new Promise((resolve, reject) => {
      const params = {
        'access_token': userSocial.access_token,
        'user_id': userSocial.user_id,
        'message': post.text,
        'in_reply_to_status_id': m ? m.social_id : ''
      };
      if (post.media.url) {
        this.fetchImage(post.media.url.toString()).then((base64img: string) => {
          params['media'] = base64img.substr(base64img.indexOf('base64,') + 'base64,'.length);
          params['isBase64'] = true; // Set to true, if media contains base64 encoded data 
          this.postPost(userSocial, params, resolve, reject);
        })
          .catch(err => {
            this.alertService.error('Incorrect url');
            reject(err.message);
          });
      } else {
        this.postPost(userSocial, params, resolve, reject);
      }

    });
  }

  reply(userSocial: UserSocial, m: Message, post: UserPost): Promise<UserSocial> {
    return this.post(userSocial, m, post);
  }

  // Retweet
  share(userSocial: UserSocial, m: Message, post: UserPost): Promise<{}> {
    return new Promise((resolve, reject) => {
      if (!this.isTwitterMessage(m)) {
        reject();
      } else {

        return this.http.post(this.apiEndPoint + '/retweet/' + m.social_id,
          {
            'access_token': userSocial.access_token,
            'user_id': userSocial.user_id,
            'message': post.text
          }).toPromise()
          .then(r => {
            const res = r.json();
            console.log('(twitter-retweet) res:' + JSON.stringify(res));
            if (res.code === 200) {
              resolve(userSocial);
            } else {
              reject(res.message);
            }
          }).catch(err => {
            console.log(err);
            reject(err);
          });
      }
    });
  }


  like(userSocial: UserSocial, m: Message, post: UserPost): Promise<{}> {
    if (m.liked.indexOf(userSocial.social_id) !== -1) {
      return this.unlike(userSocial, m, post);
    } else {

      return new Promise((resolve, reject) => {
        if (!this.isTwitterMessage(m)) {
          reject();
        } else {

          return this.http.post(this.apiEndPoint + '/like/' + m.social_id,
            {
              'access_token': userSocial.access_token,
              'user_id': userSocial.user_id,
              'message': post.text
            }).toPromise()
            .then(r => {
              const res = r.json();
              if (res.code === 200) {
                m.flags.like_count ? m.flags.like_count++ : m.flags.like_count = 1;
                m.liked.push(userSocial.social_id);
                resolve({ user: userSocial, message: m });
              } else {
                console.log('(twitter-like): ' + res.code + ':' + res.message);
                reject(userSocial);
              }
            }).catch(err => {
              console.log(err);
              reject(err);
            });
        }
      });
    }
  }

  unlike(userSocial: UserSocial, m: Message, post: UserPost): Promise<{}> {
    return new Promise((resolve, reject) => {
      if (!this.isTwitterMessage(m)) {
        reject();
      } else {

        return this.http.post(this.apiEndPoint + '/unlike/' + m.social_id,
          {
            'access_token': userSocial.access_token,
            'user_id': userSocial.user_id,
            'message': post.text
          }).toPromise()
          .then(r => {
            const res = r.json();
            if (res.code === 200) {
              m.flags.like_count ? m.flags.like_count-- : m.flags.like_count = 0;
              m.liked = m.liked.filter(id => id !== userSocial.social_id);
              resolve({ user: userSocial, message: m });
            } else {
              console.log('(twitter-unlike): ' + res.code + ':' + res.message);
              reject(res.message);
            }
          }).catch(err => {
            console.log(err);
            reject(err);
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
  private toNemoMessage(msg: TwitterMessage, userSocial: UserSocial): Message {
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
        like_count: msg.favorite_count,
        share_count: msg.retweet_count,
      },
      socialType: this.socialType,
      shared: msg.retweeted,
      liked: msg.favorited ? [userSocial.social_id] : []
    };

    return nemoMsg;

  }


  private getMedia(msg: TwitterMessage): MessageMedia[] {
    const res: MessageMedia[] = [];
    if (msg.entities.media) {
      msg.entities.media.map(m => {
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


  private fetchImage(url: string): Promise<{}> {

    return new Promise((resolve, reject) => {
      fetch(url)
        .then(res => {
          // Gets the response and returns it as a blob
          res.blob().then(blob => {

            const reader = new FileReader();
            reader.addEventListener('load', function () {
              resolve(reader.result);
            }, false);

            reader.onerror = (err) => {
              reject(err);
            };
            reader.readAsDataURL(blob);
          });
        }).catch(err => {
          console.log('Error fetching image: ' + err);
          reject(err);
        });
    });
  }

}
