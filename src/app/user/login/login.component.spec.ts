import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { UserService } from './../user.service';
import { UserServiceMock } from './../../shared/_testing/UserServiceMock';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let userServiceMock: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        LoginComponent
      ],
      providers: [
        { provide: UserService, useValue: new UserServiceMock() }
      ]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userServiceMock = fixture.debugElement.injector.get(UserService);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    let header: HTMLElement = fixture.debugElement.query(By.scss('h2')).nativeElement;
    expect(header.textContent).toContain('Por favor identifícate');
  });

  it('should call onRegister()', () => {
    spyOn(component, 'onRegister').and.callThrough();
    let button = fixture.debugElement.queryAll(By.scss('button'))[0].nativeElement;
    button.click();
    expect(component.onRegister).toHaveBeenCalled();
  });

  it('should call register() from onRegister()', () => {
    spyOn(userServiceMock, 'register').and.callThrough();
    let button = fixture.debugElement.queryAll(By.scss('button'))[0].nativeElement;
    button.click();
    expect(userServiceMock.register).toHaveBeenCalled();
  });

  it('should call onLogin()', () => {
    spyOn(component, 'onLogin').and.callThrough();
    let button = fixture.debugElement.queryAll(By.scss('button'))[1].nativeElement;
    button.click();
    expect(component.onLogin).toHaveBeenCalled();
  });

  it('should call login() from onLogin()', () => {
    spyOn(userServiceMock, 'login').and.callThrough();
    let button = fixture.debugElement.queryAll(By.scss('button'))[1].nativeElement;
    button.click();
    expect(userServiceMock.login).toHaveBeenCalled();
  });
});