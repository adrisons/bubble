import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

// importación de módulo de enrutado asociado
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
// import { RegisterModule } from './user/register/register.module';

// Importación de elementos de bootstrap
import { AppBootstrapModule } from './bootstrap/bootstrap.module';
import { UserModule } from 'app/user/user.module';
import { AlertComponent } from 'app/shared/_directives/alert/alert.component';
import { AlertService } from 'app/shared/_services/alert.service';
import { AuthService } from 'app/shared/_services/auth.service';


// decorador que define un módulo
@NgModule({
  declarations: [
    AppComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppBootstrapModule,
    FormsModule,
    HttpModule,
    HomeModule,
    UserModule,
    AppRoutingModule // el módulo de rutas ya configurado
  ],
  providers: [ AlertService, AuthService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
