import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { FacebookSocial, FacebookProfile, FacebookTimelineMsg, FacebookAttach } from 'app/shared/_models/FacebookData';
import { UserSocial, SocialType, Message, MessageMedia, MessageType } from 'app/shared/_models/data';
import { SocialServiceInterface } from 'app/shared/_interfaces/social-service.interface';
import { facebook_secret } from 'app/shared/_config/auth';
import { FacebookService as ngxFbService, LoginResponse, LoginOptions, UIResponse, UIParams } from 'ng2-facebook-sdk';
import { forEach } from '@angular/router/src/utils/collection';


@Injectable()
export class FacebookService implements SocialServiceInterface {
  private apiEndPoint = '/social/fb';
  private socialType: SocialType = { id: 0, name: 'facebook' };

  constructor(private http: AuthHttp, private fb: ngxFbService) {
    fb.init(facebook_secret);
  }

  login(): Promise<{}> {
    return new Promise((resolve, reject) => {
      const loginOptions: LoginOptions = {
        enable_profile_selector: true,
        return_scopes: true,
        scope: 'public_profile,user_friends,email,pages_show_list'
      };
      this.fb.login(loginOptions)
        .then((res: LoginResponse) => {
          console.log('Logged in', res);
          this.getProfile().then(profile => {
            const fs: FacebookSocial = {
              access_token: res.authResponse.accessToken,
              expires_at: res.authResponse.expiresIn.toString(),
              type: this.socialType,
              social_id: res.authResponse.userID,
              grantedScopes: res.authResponse.grantedScopes,
              signedRequest: res.authResponse.signedRequest,
              login: profile.name
            };
            resolve(fs);
          });
        })
        .catch((error) => {
          console.error('(login-facebook) Error: ', error);
        });
    });
  }


  logout(userId: number, token: string): Promise<{}> {
    return new Promise((resolve, reject) => {
      this.fb.logout().then(() => {
        return this.http.post(this.apiEndPoint + '/rm', { user_id: userId, access_token: token })
          .toPromise()
          .then(res => {
            console.log('Logged out!');
            resolve(res.json());
          })
          .catch((error) => {
            console.error('(logout-facebook) Error: ', error);
            reject();
          });
      });
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


  /**
   * Get the users friends
   */
  getFriends() {
    this.fb.api('/me/friends')
      .then((res: any) => {
        console.log('Got the users friends', res);
        return res;
      })
      .catch((error) => console.error('(getfriends-facebook) Error: ', error));
  }

  getTimeline(user_id, access_token) {
    return new Promise((resolve, reject) => {
      this.fb.api('/' + user_id + '/feed', 'get',
        { access_token: access_token, fields: 'id, created_time, message, from, permalink_url, picture, type, source' })
        .then((res) => {
          const messages = [];
          const requests = res.data.map((post) => {
            return new Promise((res_msgs) => {
              this.fb.api('/' + post.from.id, 'get', { access_token: access_token, fields: 'picture, link, name' }).then(user => {
                this.fb.api('/' + post.id + '/attachments', 'get', { access_token: access_token, fields: 'description, media, url' })
                  .then(attachments => {

                    messages.push(this.toNemoMessage(post, attachments.data, user));
                    res_msgs();

                  });
              });
            });
          })
          Promise.all(requests).then(() => {
            console.log('Got the user timeline', messages);
            resolve(messages);
          });

        })
        .catch((error) => {
          console.error('(gettimeline-facebook) Error: ', error);
          reject(error);
        });
    });
  }


  /**
  * Show the share dialog
  */
  share() {

    const options: UIParams = {
      method: 'share',
      href: 'https://github.com/zyramedia/ng2-facebook-sdk'
    };

    this.fb.ui(options)
      .then((res: UIResponse) => {
        console.log('Got the users profile', res);
      })
      .catch((error) => console.error('(share-facebook) Error: ', error));

  }


  // =========
  // Converter
  // =========
  private toNemoMessage(msg: FacebookTimelineMsg, attachments, user): Message {
    const date = new Date(msg.created_time.toString());
    const media: MessageMedia[] = this.attachToMedia(msg, attachments);
    const nemoMsg: Message = {
      bd_id: '',
      social_id: msg.id,
      media: media,
      dateStr: date.toLocaleString(),
      date: date,
      link: msg.permalink_url,
      text: msg.message,
      user: {
        id: user.id,
        name: user.name,
        img: user.picture.data.url,
        url: user.link
      },
      flags: {
        like: false,
        share: false,
        comment: false,
      },
      socialType: this.socialType,
      type:  this.messageTypeConverter(msg.type)
    }

    return nemoMsg;

  }
  

  
  private attachToMedia(msg: FacebookTimelineMsg, attach: FacebookAttach[]): MessageMedia[] {
    const media: MessageMedia[] = [];

    attach.forEach(a => {
      if (!a.media) {
        return;
      }
      media.push({
        text: a.description,
        img: a.media ? a.media.image.src : '',
        video: msg.source,
        url: a.url
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
