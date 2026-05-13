import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { provideRouter, Router } from '@angular/router';

import { LoginComponent } from './login';

import { ApiService } from '../../services/api';
import { CartService } from '../../services/cart';
import { ToastService } from '../../services/toast';

describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let apiServiceMock: any;
  let cartServiceMock: any;
  let toastServiceMock: any;

  let router: Router;

  beforeEach(async () => {

    localStorage.clear();

    apiServiceMock = {
      login: vi.fn().mockReturnValue(
        of({
          token: 'fake-token',
          clientId: 1,
          name: 'John'
        })
      )
    };

    cartServiceMock = {
      mergeGuestCartIntoUserCart: vi.fn(),
      reloadCart: vi.fn()
    };

    toastServiceMock = {
      show: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: apiServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);

    component = fixture.componentInstance;

    router = TestBed.inject(Router);

    vi.spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not login if fields are empty', () => {

    component.email = '';
    component.password = '';

    const formMock = {
      resetForm: vi.fn()
    };

    component.login(formMock);

    expect(apiServiceMock.login).not.toHaveBeenCalled();
  });

  it('should login successfully', () => {

    component.email = 'john@test.com';
    component.password = '1234';

    const formMock = {
      resetForm: vi.fn()
    };

    component.login(formMock);

    expect(apiServiceMock.login).toHaveBeenCalled();

    expect(localStorage.getItem('token')).toBe('fake-token');

    expect(localStorage.getItem('clientId')).toBe('1');

    expect(localStorage.getItem('name')).toBe('John');

    expect(cartServiceMock.mergeGuestCartIntoUserCart)
      .toHaveBeenCalled();

    expect(cartServiceMock.reloadCart)
      .toHaveBeenCalled();

    expect(toastServiceMock.show).toHaveBeenCalledWith(
      'Login successful!',
      'success'
    );

    expect(formMock.resetForm).toHaveBeenCalled();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show error if login fails', () => {

    apiServiceMock.login.mockReturnValue(
      throwError(() => ({
        error: {
          message: 'Invalid email or password'
        }
      }))
    );

    component.email = 'john@test.com';
    component.password = 'wrong-password';

    const formMock = {
      resetForm: vi.fn()
    };

    component.login(formMock);

    expect(toastServiceMock.show).toHaveBeenCalledWith(
      'Invalid email or password',
      'error'
    );
  });

});