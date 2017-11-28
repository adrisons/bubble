import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConfigurationComponent } from 'app/user/configuration/configuration.component';
import { OnlyLoggedInUsersGuard } from 'app/shared/_utils/onlyLoggedInUsersGuard';
// import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: 'user',
    children: [
      { path: 'login', component: LoginComponent, pathMatch: 'full' }, // Log in
      { path: 'register', component: RegisterComponent, pathMatch: 'full' }, // Register
      { path: 'config', component: ConfigurationComponent, pathMatch: 'full', canActivate: [OnlyLoggedInUsersGuard] } // Configuration
    ]
  },
  { path: '**', redirectTo: 'home' }
];

export const routableComponents = [
  LoginComponent,
  RegisterComponent,
  ConfigurationComponent
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UserRoutingModule { }
