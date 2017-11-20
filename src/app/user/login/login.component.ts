import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ServerResponseData } from 'app/shared/_models/data';
import { AlertService } from 'app/shared/_services/alert.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
/**
 * Preguntar las credenciales al usuario
 * Verificar contra el servidor
 * */
export class LoginComponent implements OnInit {

  private model = {
    email: undefined,
    password: undefined
  };


  constructor(private userService: UserService, private alertService: AlertService) { }

  ngOnInit() {

  }


  onLogin(f: NgForm) {
    // Check form
    this.userService.login(this.model)
    .subscribe(this.httpResCtrl);
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
