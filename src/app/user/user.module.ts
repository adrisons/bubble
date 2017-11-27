import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule, routableComponents } from './user-routing.module';
import { UserService } from './user.service';
import { FormsModule } from '@angular/forms';
import { UserStoreService } from 'app/shared/_services/user-store.service';
import { SharedModule } from 'app/shared/shared.module';
import { ConfigurationComponent } from './configuration/configuration.component';
import { SocialAuthService } from 'app/shared/_services/social-auth.service';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Http } from '@angular/http';
export function getAuthHttp(http: Http) {
  return new AuthHttp(new AuthConfig({
    headerName: 'x-auth-token',
    noTokenScheme: true,
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => localStorage.getItem('id_token')),
  }), http);
}

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
    UserStoreService,
    SocialAuthService,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
}
]
})
export class UserModule { }

