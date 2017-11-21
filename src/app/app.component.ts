import { Component, OnInit } from '@angular/core';
import { UserStoreService } from 'app/shared/_services/user-store.service';
import { UserData, Session } from 'app/shared/_models/data';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private title = 'Bubble';
  private needsLogin = true;
  private userName = '';

  constructor(private userStoreService: UserStoreService) { }

  ngOnInit() {
    this.userStoreService.getDataObservable().subscribe((sessionData: UserData) => {
      this.needsLogin = !sessionData.isLogged;
      if (sessionData.isLogged) {
        this.userName = sessionData.user.first_name + ' ' + sessionData.user.last_name;
      }
    });

  }

  logOut() {
    this.userStoreService.logOut();
  }
}
