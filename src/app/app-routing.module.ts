/** Módulos de enrutado de Angular2 */
import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { RegisterComponent } from './user/register/register.component';
import { HomeComponent } from './home/home.component';
import { OnlyLoggedInUsersGuard } from 'app/shared/_utils/onlyLoggedInUsersGuard';
import { LoginComponent } from 'app/user/login/login.component';
import { AppComponent } from 'app/app.component';

// Array con las rutas de este módulo
const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'home', component: HomeComponent, pathMatch: 'full', canActivate: [OnlyLoggedInUsersGuard] }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes) // configuración para el módulo raíz
  ],
  exports: [
    RouterModule // se importará desde el módulo padre
  ]
})
export class AppRoutingModule { }
