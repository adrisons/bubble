import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserSession, ServerResponseData, User } from 'app/shared/_models/data';
import { AlertService } from 'app/shared/_services/alert.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'app/user/user.service';
import { SocialAuthService } from 'app/shared/_services/social-auth.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  private user: User;
  constructor(private userService: UserService, private router: Router, private alertService: AlertService,
    private socialAuthService: SocialAuthService) { }

  ngOnInit() {
    this.user = this.userService.getProfile().user;
    this.user.social = {
      // twitter: 'twitter',
      facebook: 'facebook'
    };
  }

  logOut() {
    this.userService.logOut();
    this.router.navigate(['user/login']);
    this.alertService.warn('Bye' + (this.user ? ' ' + this.user.first_name : '') + '!');
  }

  // Save user
  onSave(f: NgForm) {
    // Check if register data is ok
    this.userService.checkRegisterData(f)
      .then(() => {
        this.userService.update(this.user)
          .subscribe(this.httpResCtrl);
      })
      .catch(error => {
        this.alertService.warn(error);
      })
      ;
  }

  fbLogin() {
    this.socialAuthService.fbLogin().then(() => {
      this.alertService.success('Facebook linked!');
    });
  }
  fbLogout() {
    this.socialAuthService.fbLogout().then(() => {
      this.alertService.success('Facebook logout!');
    });
  }

  // Process server response and shows corresponding messages
  private httpResCtrl = (res: ServerResponseData) => {
    switch (res.code) {
      case 400:
        this.alertService.error('Error ocurred');
        break;
      case 401:
        this.alertService.error('Password is not correct');
        break;
      case 403:
        this.alertService.error('User already exists');
        break;
      case 200:
        this.alertService.success('User updated successfully!');
        break;
      default:
        break;
    }
  }
}
