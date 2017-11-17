import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule, routableComponents } from './register-routing.module';
import { RegisterComponent } from './register.component';

@NgModule({
  imports: [
    CommonModule,
    RegisterRoutingModule
  ],
  declarations: [
    routableComponents // los componentes de enrutado
  ]
})
export class RegisterModule { }
