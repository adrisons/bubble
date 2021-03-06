import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { FacebookSocial, FacebookProfile, FacebookMessage, FacebookAttach } from 'app/shared/_models/FacebookData';
import { UserSocial, SocialType, Message, MessageMedia, MessageType, UserPost } from 'app/shared/_models/data';
import { SocialServiceInterface } from 'app/shared/_interfaces/social-service.interface';
import { facebook_secret } from 'app/shared/_config/auth';
import { FacebookService as ngxFbService, LoginResponse, LoginOptions, UIResponse, UIParams } from 'ng2-facebook-sdk';
import { forEach } from '@angular/router/src/utils/collection';
import { UserService } from 'app/user/user.service';
import { AlertService } from 'app/shared/_services/alert.service';


@Injectable()
export class FacebookService implements SocialServiceInterface {
  private apiEndPoint = '/social';
  private socialType: SocialType = { id: 2, name: 'facebook' };

  constructor(private http: AuthHttp, private fb: ngxFbService, private alertService: AlertService, private userService: UserService) {
    fb.init(facebook_secret);
  }

  login(user_id: String): Promise<UserSocial> {
    return new Promise((resolve, reject) => {
      const loginOptions: LoginOptions = {
        enable_profile_selector: true,
        return_scopes: true,
        scope: 'public_profile,user_friends,email,pages_show_list,publish_actions,user_posts'
      };
      this.fb.login(loginOptions)
        .then((res: LoginResponse) => {
          console.log('Logged in', res);
          this.getProfile().then(profile => {
            const data: UserSocial = {
              access_token: res.authResponse.accessToken,
              type: this.socialType,
              social_id: res.authResponse.userID,
              login: profile.name,
              user_id: user_id
            };
            this.save(data).then((us: UserSocial) => {
              resolve(us);
            });
          });
        })
        .catch((error) => {
          console.error('(login-facebook) Error: ', error);
          reject(error);
        });
    });
  }

  // Register the social network for the user (BBDD and Session)
  save(userSocial: UserSocial): Promise<UserSocial> {
    return new Promise((resolve, reject) => {

      // Save social network in BBDD
      return this.http.post(this.apiEndPoint, {
        social_id: userSocial.social_id,
        social_type_id: userSocial.type.id,
        access_token: userSocial.access_token,
        user_id: userSocial.user_id,
        login: userSocial.login,
        type_id: this.socialType.id
      })
        .toPromise()
        .then(r => {
          const res = r.json();
          if (res.code === 200) {
            // userSocial.bd_id = res.data.id;
            resolve(userSocial);
          }
          reject();
        })
        .catch(error => {
          console.log('(social login) Error: ' + error);
          reject();
        });
    });
  }

  // Not used
  logout(access_id: number): Promise<{}> {

    return new Promise((resolve, reject) => {

      // this.fb.logout().then(() => {
      //   return this.http.post(this.apiEndPoint + '/rm', { access_id: access_id })
      //     .toPromise()
      //     .then(res => {
      //       console.log('Logged out!');
      //       resolve(res.json());
      //     })
      //     .catch((error) => {
      //       console.error('(logout-facebook) Error: ', error);
      reject();
      //     });
      // });
    });
  }


  /**
 * Get the user's profile
 */
  getProfile(): Promise<FacebookProfile> {
    return new Promise((resolve, reject) => {
      this.fb.api('/me')
        .then((res: any) => {
          console.log('Got the users profile', res);
          resolve(res);
        })
        .catch((error) => {
          console.error('(getprofile-facebook) Error: ', error);
          reject();
        });
    });

  }

  private parseTimeline(results, access_token, resolve, reject) {
    const messages = [];
    const requests = results.data.map((post) => {
      return new Promise((res_msgs) => {
        // Get user image and link
        this.fb.api('/' + post.from.id, 'get', { access_token: access_token, fields: 'picture, link, name' })
          .then(user => {
            // Get attachments
            this.fb.api('/' + post.id + '/attachments', 'get',
              { access_token: access_token, fields: 'description, media, url' })
              .then(attachments => {
                // Get likes
                this.fb.api('/' + post.id + '/likes', 'get',
                  { access_token: access_token, fields: 'total_count' })
                  .then(likes => {
                    post.likes = [];
                    likes.data.map(d => post.likes.push(d.id));
                    messages.push(this.toNemoMessage(post, attachments.data, user));
                    res_msgs();
                  });
              });
          });
      });
    });
    Promise.all(requests).then(() => {
      console.log('Got the user timeline', messages);
      resolve(messages);
    });
  }

  parseNextStr(userSocial: UserSocial, next: string) {
    const idx = next.indexOf(userSocial.social_id.toString());
    if (idx !== -1) {
      return next.substring(idx - 1);
    } else {
      return '';
    }
  }
  // Get the timeline for the user
  getTimeline(userSocial: UserSocial): Promise<Array<Message>> {
    return new Promise((resolve, reject) => {
      this.fb.api('/' + userSocial.social_id + '/feed', 'get',
        { access_token: userSocial.access_token, fields: 'id, created_time, message, from, permalink_url, type, shares' })
        .then((res) => {
          // Add the next page to the session
          this.userService.addSocialNextTimeline(userSocial, res.paging.next);
          this.parseTimeline(res, userSocial.access_token, resolve, reject);
        })
        .catch((error) => {
          console.error('(gettimeline-facebook) Error: ', error);
          reject(error.message);
        });
    });
  }

  // Get the next messages of timeline for the user
  getNextTimeline(userSocial: UserSocial): Promise<Array<Message>> {
    return new Promise((resolve, reject) => {
      if (userSocial.next) {
        const url = this.parseNextStr(userSocial, userSocial.next.toString());
        this.fb.api(url, 'get')
          .then((res) => {
            // Add the next page to the session
            this.userService.addSocialNextTimeline(userSocial, res.paging.next);
            this.parseTimeline(res, userSocial.access_token, resolve, reject);
          })
          .catch((error) => {
            console.error('(getnexttimeline-facebook) Error: ', error);
            reject(error.message);
          });
      } else {
        reject('Facebook can not fetch more messages. No link');
      }
    });
  }

  private postPost(userSocial: UserSocial, m: Message, post: UserPost, params, resolve, reject) {
    this.fb.api('/' + userSocial.social_id + '/feed', 'post',
      params).then(res => {
        console.log(res);
        resolve(userSocial);
      }).catch(err => {
        console.log(err);
        reject(err.message);
      });
  };
  // Post message in name of the user
  post(userSocial: UserSocial, m: Message, post: UserPost): Promise<UserSocial> {
    return new Promise((resolve, reject) => {
      const params = {
        'access_token': userSocial.access_token,
        'message': post.text
      };
      // Upload media
      if (post.media.url) {
        this.uploadMedia(userSocial, m, post).then((res: { id, post_id }) => {
          params['object_attachment'] = res.id;
          this.postPost(userSocial, m, post, params, resolve, reject);
        });
      } else {
        this.postPost(userSocial, m, post, params, resolve, reject);
      }
    });
  }


  // Post message in name of the user
  reply(userSocial: UserSocial, m: Message, post: UserPost): Promise<UserSocial> {
    return new Promise((resolve, reject) => {
      this.fb.api('/' + userSocial.social_id + '/feed', 'post',
        {
          'access_token': userSocial.access_token,
          'message': post.text,
          'link': m.url
        }).then(res => {
          console.log(res);
          resolve(userSocial);
        }).catch(err => {
          console.log(err);
          reject(err.message);
        });
    });
  }

  share(userSocial: UserSocial, m: Message, post: UserPost): Promise<{}> {
    return this.reply(userSocial, m, post);
  }

  like(userSocial: UserSocial, m: Message, post: UserPost): Promise<{}> {
    if (m.liked.indexOf(userSocial.social_id) !== -1) {
      return this.unlike(userSocial, m, post);
    } else {
      return new Promise((resolve, reject) => {
        this.fb.api('/' + m.social_id + '/likes', 'post',
          {
            'access_token': userSocial.access_token
          }).then(res => {
            console.log(res);
            m.flags.like_count ? m.flags.like_count++ : m.flags.like_count = 1;
            m.liked.push(userSocial.social_id);
            resolve({ user: userSocial, message: m });
          }).catch(err => {
            console.log(err);
            reject(err.message);
          });
      });
    }
  }

  unlike(userSocial: UserSocial, m: Message, post: UserPost): Promise<{}> {
    return new Promise((resolve, reject) => {
      this.fb.api('/' + m.social_id + '/likes', 'delete',
        {
          'access_token': userSocial.access_token
        }).then(res => {
          console.log(res);
          m.flags.like_count ? m.flags.like_count-- : m.flags.like_count = 0;
          m.liked = m.liked.filter(id => id !== userSocial.social_id);
          resolve({ user: userSocial, message: m });
        }).catch(err => {
          console.log(err);
          reject(err.message);
        });
    });
  }


  uploadMedia(userSocial: UserSocial, m: Message, post: UserPost): Promise<{}> {
    // 1. Upload media -> get the media url
    // 2. Publish media

    return new Promise((resolve, reject) => {
      this.fb.api('/' + userSocial.social_id + '/photos', 'post',
        {
          'url': post.media.url,
          // 'caption': post.media.text,
          'access_token': userSocial.access_token
        }).then(res => {
          console.log(res);
          resolve(res);
        }).catch(err => {
          console.log(err);
          reject(err.message);
        });
    });

  }
  // =================
  // Private functions
  // =================
  private toNemoMessage(msg: FacebookMessage, attachments, user): Message {
    const date = new Date(msg.created_time.toString());
    const media: MessageMedia[] = this.attachToMedia(msg, attachments);
    const nemoMsg: Message = {
      id: '',
      social_id: msg.id,
      media: media,
      dateStr: date.toLocaleString(),
      date: date,
      url: msg.permalink_url,
      text: msg.message,
      user: {
        id: user.id,
        name: user.name,
        img: user.picture.data.url,
        url: user.link
      },
      flags: {
        like: false,
        like_count: msg.likes.length,
        share: false,
        share_count: msg.shares ? msg.shares.count : 0,
        comment: false,
        // comment_count?: Number;
      },
      socialType: this.socialType,
      liked: msg.likes
    };

    return nemoMsg;

  }



  private attachToMedia(msg: FacebookMessage, attach: FacebookAttach[]): MessageMedia[] {
    const media: MessageMedia[] = [];

    attach.map(a => {
      if (!a.media) {
        return;
      }
      const mType = this.messageTypeConverter(msg.type);
      let src;
      // if (mType === MessageType.video) {

      //   src = a.url;
      // } else {
      src = a.media ? a.media.image.src : '';
      // }

      media.push({
        text: a.description !== msg.message ? a.description : '',
        src: src,
        url: a.url,
        type: mType

      });
    });
    return media;
  }


  private messageTypeConverter(facebookType): MessageType {

    switch (facebookType) {
      case 'link':
        return MessageType.share;
      case 'status':
        return MessageType.text;
      case 'photo':
        return MessageType.photo;
      case 'video':
        return MessageType.video;
      default:
        return MessageType.text;

    }
  }
}
