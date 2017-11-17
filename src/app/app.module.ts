import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

// importación de módulo de enrutado asociado
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { RegisterModule } from './user/register/register.module';
// import { LoginModule } from './user/login/login.module';

// Importación de elementos de bootstrap
import { AppBootstrapModule } from './bootstrap/bootstrap.module';
import { UserModule } from 'app/user/user.module';


// decorador que define un módulo
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppBootstrapModule,
    FormsModule,
    HttpModule,
    HomeModule,
    RegisterModule,
    UserModule,
    // LoginModule,
    AppRoutingModule // el módulo de rutas ya configurado
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
