import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ServerResponseData, UserSession } from 'app/shared/_models/data';
import { AlertService } from 'app/shared/_services/alert.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
/**
 * Preguntar las credenciales al usuario
 * Verificar contra el servidor
 * */
export class LoginComponent implements OnInit {

  private loginData = {
    email: undefined,
    password: undefined
  };

  constructor(private userService: UserService, private alertService: AlertService, private router: Router) { }

  ngOnInit() {

  }


  onLogin(f: NgForm) {
    // Check form
    if (f.valid) {
      this.userService.login(this.loginData)
      .subscribe(this.httpResCtrl);
    } else {
      this.alertService.error('Error: please check the form');
    }
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
        this.router.navigate(['']);
        const UserSession: UserSession = this.userService.getProfile();
        this.alertService.success('Welcome' + (UserSession.user ? ' ' + UserSession.user.first_name : '') + '!');
        break;
      default:
        break;
    }
  }

}
