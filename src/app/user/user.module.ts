import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule, routableComponents } from './user-routing.module';
import { UserService } from './user.service';
import { FormsModule } from '@angular/forms';
import { UserStoreService } from 'app/shared/_services/user-store.service';
import { SharedModule } from 'app/shared/shared.module';
import { ConfigurationComponent } from './configuration/configuration.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UserRoutingModule,
    SharedModule
  ],
  declarations: [
    routableComponents,
    ConfigurationComponent
  ],
  providers: [
    UserService,
    UserStoreService
]
})
export class UserModule { }

