import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AuthService } from './auth';
import { CartService } from './cart';

describe('AuthService', () => {

  let service: AuthService;

  let cartServiceMock: any;

  beforeEach(() => {

    localStorage.clear();

    cartServiceMock = {
      clearCart: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: CartService, useValue: cartServiceMock }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if user is logged in', () => {

    localStorage.setItem('token', 'fake-token');

    expect(service.isLoggedIn()).toBe(true);
  });

  it('should return false if user is not logged in', () => {

    localStorage.removeItem('token');

    expect(service.isLoggedIn()).toBe(false);
  });

  it('should remove auth data on logout', () => {

    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('clientId', '1');
    localStorage.setItem('name', 'John');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();

    expect(localStorage.getItem('clientId')).toBeNull();

    expect(localStorage.getItem('name')).toBeNull();
  });

  it('should return stored username', () => {

    localStorage.setItem('name', 'John');

    expect(service.getUserName()).toBe('John');
  });

});