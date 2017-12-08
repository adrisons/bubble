
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';
import { SocialService } from 'app/shared/_services/social.service';
import { UserSocial, SocialAuthResult } from 'app/shared/_models/data';
import { AlertService } from 'app/shared/_services/alert.service';

@Injectable()
export class SocialAuthService {

  auth0 = new auth0.WebAuth({
    clientID: 'MHoFMOs24vBj8T-xbZT5GTGWU_GeRLPS',
    domain: 'pepino.eu.auth0.com',
    responseType: 'token id_token',
    audience: 'https://pepino.eu.auth0.com/userinfo',
    redirectUri: 'http://localhost:4200/user/config',
    scope: 'openid'
  });

  constructor(public router: Router, private alertService: AlertService, private socialService: SocialService) { }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        const socialNetworkName = authResult.idTokenPayload.sub.split('|')[0];
        // Set the time that the access token will expire at
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        // Guardar token en bbdd
        // Guardar token en session
        const socialAuthResult: SocialAuthResult = {
          'network_name': socialNetworkName,
          'access_token': authResult.accessToken,
          'id_token': authResult.idToken,
          'expires_at': expiresAt
        };

        this.socialService.save(socialAuthResult).then().catch((error) =>
          console.log('(social-auth) Error saving auth: ' + error)
        );


      } else if (err) {
        this.router.navigate(['/home']);
        console.log('(social-auth) Error handling auth: ' + err);
      }
    });

  }

  // Remove the authentication information from one social media
  // public logout(social: UserSocial): void {
  //   // Remove tokens and expiry time from localStorage
  //   this.socialService.logout(social.type, social.token)
  //     .then(() => {
  //       this.alertService.success(social.type.name + ' logout!');
  //     })
  //     .catch(() => this.alertService.error('Error removing ' + social.type.name));
  // }

  // public isAuthenticated(): boolean {
  //   // Check whether the current time is past the
  //   // access token's expiry time
  //   const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
  //   return new Date().getTime() < expiresAt;
  // }

}
