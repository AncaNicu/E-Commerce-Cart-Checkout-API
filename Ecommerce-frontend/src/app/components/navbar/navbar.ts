import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {

  cartItems$;

  constructor(
    private cart: CartService,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.cartItems$ = this.cart.items$;
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout();
    this.toast.show('Logged out', 'info');
    this.router.navigate(['/login']);
  }

  getCartCount(items: any[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getUserName(): string | null {
    return this.auth.getUserName();
  }

}
