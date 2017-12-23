
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';
import { SocialService } from 'app/shared/_services/social.service';
import { UserSocial, SocialAuthResult } from 'app/shared/_models/data';
import { AlertService } from 'app/shared/_services/alert.service';
import { auth0_secret } from 'app/shared/_config/auth';
import { UserService } from 'app/user/user.service';


@Injectable()
export class SocialAuthService {

  private auth = new auth0.WebAuth(auth0_secret);

  constructor(public router: Router, private alertService: AlertService, private socialService: SocialService,
    private userService: UserService) { }

  public login(): void {
    this.auth.authorize();
  }

  public handleAuthentication(): void {
    this.auth.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        const socialNetworkName = authResult.idTokenPayload.sub.split('|')[0];
        // Set the time that the access token will expire at
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());

        const userSocial: UserSocial = {
          type: {
            id: this.getSocialNetworkType(socialNetworkName),
            name: socialNetworkName
          },
          login: null,
          email: null,
          social_id: authResult.id, // Esto deberia ser el id del usuario en la red social
          access_token: authResult.accessToken,
          expires_at: expiresAt,
          user_id: this.userService.getProfile().user.id.toString()
        };
        // Get user information
        this.auth.client.userInfo(userSocial.access_token, (profile_err, profile) => {
          if (profile_err) {
            console.log('(social-auth) Error getting profile: ' + err);
            return;
          }
          this.setProfile(userSocial, profile);

          this.socialService.getUserData(userSocial).catch((error) =>
            console.log('(social-auth) Error saving auth: ' + error)
          );
        });

      } else if (err) {
        this.router.navigate(['/home']);
        console.log('(social-auth) Error handling auth: ' + err);
      }
    });

  }

  // Remove the authentication information from one social media
  public logout(us: UserSocial): void {
    // Remove tokens and expiry time from localStorage
    this.socialService.remove(us)
      .then(() => {
        this.alertService.success(us.type.name + ' logout!');
      })
      .catch(() => this.alertService.error('Error removing ' + us.type.name));
  }

  // public isAuthenticated(): boolean {
  //   // Check whether the current time is past the
  //   // access token's expiry time
  //   const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
  //   return new Date().getTime() < expiresAt;
  // }

  private getSocialNetworkType(name: string): number {
    switch (name) {
      case 'facebook':
        return 0;
      case 'twitter':
        return 1;
      default:
        break;
    }
  }

  // Sets user profile from social network
  private setProfile(userSocial: UserSocial, profile) {
    const i = profile.sub.indexOf('|');
    if (i !== -1) {
      userSocial.social_id = profile.sub.slice(i + 1);
    }
    switch (userSocial.type.name) {
      case 'facebook':
        userSocial.login = profile.name;
        break;
      case 'twitter':
        userSocial.login = profile.nickname;
        break;
      default:
        break;
    }
  }



}
