import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

// importación de módulo de enrutado asociado
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from 'app/home/home.module';
import { RegisterModule } from 'app/register/register.module';
import { LoginModule } from 'app/login/login.module';

// decorador que define un módulo
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HomeModule,
    RegisterModule,
    LoginModule,
    AppRoutingModule // el módulo de rutas ya configurado
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
