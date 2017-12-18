import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';
import { HttpService } from './_services/http.service';
import { NgModule } from '@angular/core';

import { AlertComponent } from './_directives/alert/alert.component';
import { AlertService } from 'app/shared/_services/alert.service';
import { CrudService } from 'app/shared/_services/crud.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';

import { TwitterService } from 'app/shared/_services/twitter.service';
import { SocialService } from 'app/shared/_services/social.service';
import { SocialAuthService } from 'app/shared/_services/social-auth.service';
import { FacebookService } from 'app/shared/_services/facebook.service';
import { FacebookModule } from 'ng2-facebook-sdk';
import { FilterPipe } from 'app/shared/_pipes/filter.pipe';
import { SortByPipe } from 'app/shared/_pipes/sortBy.pipe';

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
    HttpModule,
    FacebookModule.forRoot()
  ],
  providers: [
    {
      provide: Http, // remplaza el servicio original de angular
      useClass: HttpService // con nuestra extensión personalizada
    },
    UserSessionService,
    AlertService,
    CrudService,
    SocialService,
    FacebookService,
    TwitterService,
    SocialAuthService,
    SocialService
  ],
  exports: [// Lo que aquí se exporte se importará en los módulos funcionales
    CommonModule,
    FormsModule
  ],
  declarations: []
})
export class SharedModule { }
