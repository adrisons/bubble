import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService } from './_services/http.service';
import { NgModule } from '@angular/core';
import { UserStoreService } from './_services/user-store.service';
import { AlertComponent } from './_directives/alert/alert.component';
import { AlertService } from 'app/shared/_services/alert.service';
import { AuthService } from 'app/shared/_services/auth.service';
import { CrudService } from 'app/shared/_services/crud.service';
/**
 * El módulo compartido se importa en todos los demás módulos
 * Con dos propósitos:
 *  - unificar las dependencias externas comunes
 *  - definir componentes y servicios reutilizables por la aplicación
 */
@NgModule({
  imports: [// Módulos necesarios
    CommonModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    {
      provide: Http, // remplaza el servicio original de angular
      useClass: HttpService // con nuestra extensión personalizada
    },
    UserStoreService,
    AlertService,
    AuthService,
    CrudService
  ],
  exports: [// Lo que aquí se exporte se importará en los módulos funcionales
    CommonModule,
    FormsModule
  ],
  declarations: []
})
export class SharedModule { }
