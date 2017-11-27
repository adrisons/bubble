import { TestBed } from '@angular/core/testing';
import { UserSession } from '../_models/data';
import { UserStoreService } from './user-store.service';

describe(('UserStoreService'), () => {
  const dataKey = 'user-data';
  let userStoreService: UserStoreService;
  const user = 'testUser';
  const token = 'eyJhbGciOiJIUzI1NiIsInR9';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserStoreService
      ]
    });
    userStoreService = TestBed.get(UserStoreService);
  });

  it('should logIn and store a user', () => {
    spyOn(userStoreService, 'logIn').and.callThrough();
    // userStoreService.logIn(user, token);
    const UserSession: UserSession = JSON.parse(localStorage.getItem(dataKey));
    expect(userStoreService.logIn).toHaveBeenCalled();
    expect(user).toEqual(UserSession.user);
    expect(token).toEqual(UserSession.token);
    expect(UserSession.isLogged).toBeTruthy();
  });

  it('should get the logged in user information', () => {
    spyOn(userStoreService, 'getProfile').and.callThrough();
    const UserSession: UserSession = userStoreService.getProfile();
    expect(userStoreService.getProfile).toHaveBeenCalled();
    expect(user).toEqual(UserSession.user);
    expect(token).toEqual(UserSession.token);
    expect(UserSession.isLogged).toBeTruthy();
  });

  it('should logout a user', () => {
    spyOn(userStoreService, 'logOut').and.callThrough();
    // userStoreService.logOut(user, token);
    // const UserSession: UserSession = localStorage.getItem(dataKey);
    expect(userStoreService.logOut).toHaveBeenCalled();
    expect(user).toBeNull;
    expect(token).toBeNull;
    // expect(UserSession.isLogged).toBeFalsy();
  });
});
