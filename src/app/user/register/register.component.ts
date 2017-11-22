import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/user/user.service';
import { AlertService } from 'app/shared/_services/alert.service';
import { ServerResponseData, UserData } from 'app/shared/_models/data';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private registerData = {
    first_name: null,
    last_name: null,
    email: null,
    password: null
  };
  constructor(private userService: UserService, private alertService: AlertService, private router: Router) { }

  ngOnInit() {
  }

  // Check form data to see if its correct
  // Return: Promise with error message
  checkRegisterData(f: NgForm): Promise<string> {
    return new Promise((resolve, reject) => {
      if (f.valid) {
        if (this.registerData.password.length < 8) {
          reject('Password length must be > 8!');
        }
        resolve();
      } else {
        reject('Check the fields!');
      }
    } );

  }

  // User clicks on the register button
  onRegister(f: NgForm) {
    // Check if register data is ok
    this.checkRegisterData(f)
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
        const userData: UserData = this.userService.getProfile();
        this.alertService.success('Welcome' + (userData.user ? ' ' + userData.user.first_name : '') + '!');
        break;
      default:
        break;
    }
  }

}
