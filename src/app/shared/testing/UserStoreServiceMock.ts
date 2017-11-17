import { UserData } from './../model/data.class';

export class UserStoreServiceMock {

  public logIn(user, token) {

  }

  public logOut(user, token) {

  }

  public getProfile(): UserData {
    const userData: UserData = new UserData();
    userData.user = 'testUser';
    userData.token = 'eyJhbGciOiJIUzI1NiIsInR9';
    userData.isLogged = false;
    return userData;
  }
}