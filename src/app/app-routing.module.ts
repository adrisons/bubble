/** Módulos de enrutado de Angular2 */
import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

// Array con las rutas de este módulo. Ninguna funcional.
const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'inicio', redirectTo: '', pathMatch: 'full'  },
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
