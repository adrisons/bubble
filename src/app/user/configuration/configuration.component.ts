import { Component, OnInit } from '@angular/core';
import { UserStoreService } from 'app/shared/_services/user-store.service';
import { Router } from '@angular/router';
import { UserData } from 'app/shared/_models/data';
import { AlertService } from 'app/shared/_services/alert.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  constructor(private userStoreService: UserStoreService, private router: Router, private alertService: AlertService ) { }

  ngOnInit() {
  }

  logOut() {
    this.userStoreService.logOut();
    this.router.navigate(['user/login']);
    const userData: UserData = this.userStoreService.getProfile();
    this.alertService.warn('Bye' + (userData.user ? ' ' + userData.user.first_name : '') + '!');
  }

}
