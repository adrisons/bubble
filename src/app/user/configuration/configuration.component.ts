import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserData, ServerResponseData } from 'app/shared/_models/data';
import { AlertService } from 'app/shared/_services/alert.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'app/user/user.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  private userData: UserData;
  constructor(private userService: UserService, private router: Router, private alertService: AlertService ) { }

  ngOnInit() {
    this.userData = this.userService.getProfile();
  }

  logOut() {
    this.userService.logOut();
    this.router.navigate(['user/login']);
    this.alertService.warn('Bye' + (this.userData.user ? ' ' + this.userData.user.first_name : '') + '!');
  }

  // Save user
  onSave(f: NgForm) {
    // Check if register data is ok
    this.userService.checkRegisterData(f)
    .then (() => {
      this.userService.update(this.userData.user)
      .subscribe(this.httpResCtrl);
    })
    .catch(error => {
      this.alertService.warn(error);
    })
    ;
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
