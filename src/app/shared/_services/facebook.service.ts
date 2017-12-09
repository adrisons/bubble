import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { UserSocial, SocialType, FacebookSocial, FacebookProfile } from 'app/shared/_models/data';
import { SocialServiceInterface } from 'app/shared/_interfaces/social-service.interface';
import { facebook_secret } from 'app/shared/_config/auth';
import { FacebookService as ngxFbService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';
// declare const FB: any;
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
            }


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
      })
      .catch((error) => console.error('(getfriends-facebook) Error: ', error));
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

}
