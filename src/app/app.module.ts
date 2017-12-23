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


import { SharedModule } from 'app/shared/shared.module';
import { AlertComponent } from 'app/shared/_directives/alert/alert.component';

import { OnlyLoggedInUsersGuard } from 'app/shared/_utils/onlyLoggedInUsersGuard';
import { PostComponent } from './home/post/post.component';
import { SortByPipe } from 'app/shared/_pipes/sortBy.pipe';
import { MessagePipe, UserPipe, SocialPipe, SafeUrlPipe, NotEmptyPipe } from 'app/shared/_pipes/filter.pipe';

// decorador que define un módulo
@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent,
    PostComponent,
    SortByPipe, MessagePipe, UserPipe, SocialPipe, SafeUrlPipe, NotEmptyPipe
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
  providers: [ OnlyLoggedInUsersGuard ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
