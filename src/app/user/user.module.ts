import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule, routableComponents } from './user-routing.module';
import { UserService } from './user.service';
import { FormsModule } from '@angular/forms';
import { UserStoreService } from 'app/shared/_services/user-store.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UserRoutingModule
  ],
  declarations: [
    routableComponents
  ],
  providers: [
    UserService,
    UserStoreService
]
})
export class UserModule { }

