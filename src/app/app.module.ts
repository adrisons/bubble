import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

// importación de módulo de enrutado asociado
import { AppRoutingModule } from './app-routing.module';
// importación de otros módulos de funcionalidad
import { HomeModule } from './home/home.module';
// decorador que define un módulo
@NgModule({
  declarations: [ AppComponent ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HomeModule, // el módulo funcional para la 'página home'
    AppRoutingModule // el módulo de rutas ya configurado
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
