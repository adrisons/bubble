import { Component, OnInit } from '@angular/core';

import { UserSession, Session } from 'app/shared/_models/data';
import { Observable } from 'rxjs/Observable';
import { UserSessionService } from 'app/shared/_services/user-session.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private title = 'Bubble';
  private needsLogin = true;
  private userName = '';

  constructor(private userSessionService: UserSessionService) { }

  ngOnInit() {
    this.userSessionService.getDataObservable().subscribe((sessionData: UserSession) => {
      this.needsLogin = !sessionData.isLogged;
      if (sessionData.isLogged) {
        this.userName = sessionData.user.first_name + ' ' + sessionData.user.last_name;
      }
    });

  }


}
