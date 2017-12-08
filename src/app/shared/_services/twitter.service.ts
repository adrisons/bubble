import { Injectable } from '@angular/core';
import { SocialServiceInterface } from 'app/shared/_interfaces/social-service.interface';
import { UserSocial, SocialType } from 'app/shared/_models/data';
import { AuthHttp } from 'angular2-jwt';
// import Twitter from 'node-twitter-api';
// import { twitter_secret } from 'app/shared/_config/auth';
const apiEndPoint = '/social/tw';

// const twitter = new Twitter(twitter_secret);
// let _requestSecret;

@Injectable()
export class TwitterService implements SocialServiceInterface {
  constructor(private http: AuthHttp) {

  }


  login(userId: number) {
    return new Promise((resolve, reject) => {
      return this.http.post(apiEndPoint, { user_id: userId, access_token: 'test_twitter_access_token' })
        .toPromise()
        .then(res => {
          resolve(res.json());
        })
        .catch(() => reject());
    });
  }


  logout(userId: number, token: string) {
    return new Promise((resolve, reject) => {
      return this.http.post(apiEndPoint + '/rm', { user_id: userId, access_token: token })
        .toPromise()
        .then(res => {
          resolve(res.json());
        })
        .catch(() => reject());
    });
  }




  // requestToken = function () {
  //   twitter.getRequestToken(function (err, requestToken, requestSecret) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       _requestSecret = requestSecret;
  //       const twitterurl = 'https://api.twitter.com/oauth/authenticate?oauth_token=' + requestToken;
  //       window.open(twitterurl, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
  //     }
  //   });
  // };

  // accessToken = function (req, res) {
  //   const requestToken = req.query.oauth_token,
  //     verifier = req.query.oauth_verifier;

  //   twitter.getAccessToken(requestToken, _requestSecret, verifier, function (err, accessToken, accessSecret) {
  //     if (err) {
  //       res.status(500).send(err);
  //     } else {
  //       twitter.verifyCredentials(accessToken, accessSecret, function (err, user) {
  //         if (err) {
  //           res.status(500).send(err);
  //         } else {
  //           res.send(user);
  //         }
  //       });
  //     }
  //   });
  // };



}
