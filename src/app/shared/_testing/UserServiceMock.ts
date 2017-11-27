import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { UserSession } from './../_models/data';

export class UserServiceMock {
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

  public login(credenciales) {
    const options = new ResponseOptions({
      status: 200,
      body: this.token
    });
    return Observable.of(new Response(options));
  }

  public register(credenciales) {
    const options = new ResponseOptions({
      status: 201,
      body: this.token
    });
    return Observable.of(new Response(options));
  }

  public getProfile(): UserSession {
    const user: UserSession = new UserSession();
    // user.user = 'testingUser';
    user.token = this.token;
    user.isLogged = false;
    return user;
  }

}
