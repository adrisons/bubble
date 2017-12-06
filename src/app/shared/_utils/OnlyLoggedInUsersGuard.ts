
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AlertService } from 'app/shared/_services/alert.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';


@Injectable()
export class OnlyLoggedInUsersGuard implements CanActivate {

  constructor(private sessionService: UserSessionService, private router: Router, private alertService: AlertService) {};

  canActivate() {
    console.log('OnlyLoggedInUsers');
    if (this.sessionService.isLoggedIn()) {
      return true;
    } else {
      this.alertService.error('Please log in first');
      this.router.navigate(['user/login']);
      return false;
    }
  }
}
