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


import { OnlyLoggedInUsersGuard } from 'app/shared/_utils/onlyLoggedInUsersGuard';
// import { SortByPipe } from 'app/shared/_pipes/sortBy.pipe';
// import { MessagePipe, UserPipe, SocialPipe, SafeUrlPipe, NotEmptyPipe } from 'app/shared/_pipes/filter.pipe';
// import { PublishComponent } from 'app/shared/_directives/publish/publish.component';


// decorador que define un módulo
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    // SortByPipe, MessagePipe, UserPipe, SocialPipe, SafeUrlPipe, NotEmptyPipe, PublishComponent
  ],
  imports: [
    BrowserModule,
    AppBootstrapModule,
    // FormsModule,
    // HttpModule,
    UserModule,
    SharedModule,
    AppRoutingModule // el módulo de rutas ya configurado
  ],
  providers: [ OnlyLoggedInUsersGuard ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
