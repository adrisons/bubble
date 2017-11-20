import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/user/user.service';
import { AlertService } from 'app/shared/_services/alert.service';
import { ServerResponseData } from 'app/shared/_models/data';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private registerData = {
    first_name: null,
    last_name: null,
    email: null,
    password: null
  };
  constructor(private userService: UserService, private alertService: AlertService) { }

  ngOnInit() {
  }


  checkRegisterData(): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve('');
    } );

  }

  /**
   * User clicks on the register button
   */
  onRegister() {
    // Check if register data is ok
    this.checkRegisterData()
    .then (error => {
      if (!error) {
      this.userService.register(this.registerData)
      .subscribe(this.httpResCtrl);
      } else {
        this.alertService.warn(error);
      }
    });
  }

  private httpResCtrl = (res: ServerResponseData) => {
    switch (res.code) {
      case 400:
        this.alertService.error('Error ocurred');
        break;
      case 401:
        this.alertService.error('Password is not correct');
        break;
      case 403:
        this.alertService.error('User does not exist');
        break;
      case 200:
        this.alertService.success('Welcome!');
        break;
      default:
        break;
    }
  }

}
