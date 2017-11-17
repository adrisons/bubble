/** Módulos de enrutado de Angular2 */
import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { RegisterComponent } from './user/register/register.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login/login.component';

// Array con las rutas de este módulo
const routes: Routes = [
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'user/register', component: RegisterComponent },
  { path: 'user/login', component: LoginComponent }


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
