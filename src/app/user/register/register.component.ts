import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/user/user.service';
import { AlertService } from 'app/shared/_services/alert.service';
import { ServerResponseData, UserSession, User } from 'app/shared/_models/data';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private registerData: User = new User();

  constructor(private userService: UserService, private alertService: AlertService, private router: Router) { }

  ngOnInit() {
  }


  // User clicks on the register button
  onRegister(f: NgForm) {
    // Check if register data is ok
    this.userService.checkRegisterData(f)
    .then (() => {
      this.userService.register(this.registerData)
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
        this.router.navigate(['']);
        const UserSession: UserSession = this.userService.getProfile();
        this.alertService.success('Welcome' + (UserSession.user ? ' ' + UserSession.user.first_name : '') + '!');
        break;
      default:
        break;
    }
  }

}
