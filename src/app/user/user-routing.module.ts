import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
// import { UserComponent } from './user.component';

const routes: Routes = [
  // { path: 'user', component: UserComponent, data: { title: 'Current User' } }, // profile
  { path: 'user/login', component: LoginComponent, data: { title: 'Log In' } } // Log in screen
];

export const routableComponents = [
  LoginComponent
  // UserComponent
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UserRoutingModule { }
