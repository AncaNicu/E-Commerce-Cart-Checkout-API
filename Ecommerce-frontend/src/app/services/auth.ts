import { Injectable } from '@angular/core';
import { CartService } from './cart';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('clientId');
    localStorage.removeItem('token');
    localStorage.removeItem('name');
  }

  getUserName(): string | null {
    return localStorage.getItem('name');
  }

}
