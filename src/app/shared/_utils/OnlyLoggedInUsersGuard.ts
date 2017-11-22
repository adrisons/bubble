import { UserStoreService } from 'app/shared/_services/user-store.service';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AlertService } from 'app/shared/_services/alert.service';


@Injectable()
export class OnlyLoggedInUsersGuard implements CanActivate {

  constructor(private userService: UserStoreService, private router: Router, private alertService: AlertService) {};

  canActivate() {
    console.log('OnlyLoggedInUsers');
    if (this.userService.isLoggedIn()) {
      return true;
    } else {
      this.alertService.error('Please log in first');
      this.router.navigate(['user/login']);
      return false;
    }
  }
}
