import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

// importación de módulo de enrutado asociado
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';

// Importación de elementos de bootstrap
import { AppBootstrapModule } from './bootstrap/bootstrap.module';
import { UserModule } from 'app/user/user.module';
import { AlertService } from 'app/shared/_services/alert.service';

import { SharedModule } from 'app/shared/shared.module';
import { AlertComponent } from 'app/shared/_directives/alert/alert.component';

import { OnlyLoggedInUsersGuard } from 'app/shared/_utils/onlyLoggedInUsersGuard';
import { FacebookService } from 'ngx-facebook/dist/esm/providers/facebook';




// decorador que define un módulo
@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppBootstrapModule,
    FormsModule,
    HttpModule,
    UserModule,
    SharedModule,
    AppRoutingModule // el módulo de rutas ya configurado
  ],
  providers: [ OnlyLoggedInUsersGuard, FacebookService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
