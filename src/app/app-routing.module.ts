/** Módulos de enrutado de Angular2 */
import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { OnlyLoggedInUsersGuard } from 'app/shared/_utils/onlyLoggedInUsersGuard';

// Array con las rutas de este módulo
const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'home', component: HomeComponent, pathMatch: 'full', canActivate: [OnlyLoggedInUsersGuard] }
    ]
  },
  { path: '**', redirectTo: ''}

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
