import { Component } from '@angular/core';
import { AuthService } from 'app/shared/_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bubble';
  needsLogin = true;
  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.auth.isAuthenticated().then((authenticated) => {
      this.needsLogin = !authenticated;
    })
  }
}
