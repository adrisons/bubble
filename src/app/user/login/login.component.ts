import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ServerResponse } from 'app/shared/model/data.class';

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

  private credentials = {
    email: '',
    password: ''
  };

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  onRegister() {
    this.userService.register(this.credentials)
    .subscribe(this.httpResCtrl);
  }

  onLogin() {
    this.userService.login(this.credentials)
    .subscribe(this.httpResCtrl);
  }

  showError(control) {
    return control.errors && (control.dirty || control.touched);
  }



  private httpResCtrl = function(res: ServerResponse) {
    switch (res.code) {
      case 400:
        return 'Error ocurred';
      case 401:
        return 'Password is not correct';
      case 403:
        return 'User does not exist';
      case 200:
        return 'Sucessfull';
      default:
        break;
    }
  };
}
