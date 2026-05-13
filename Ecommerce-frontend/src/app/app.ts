import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartService } from './services/cart';
import { NavbarComponent } from './components/navbar/navbar';
import { ToastComponent } from './components/toast/toast';
import { FooterComponent } from './components/footer/footer';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ToastComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('Ecommerce-frontend');
  
  cartItems$;

  constructor(private cart: CartService) {
    this.cartItems$ = this.cart.items$;
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('clientId');
  }

  logout() {
    localStorage.removeItem('clientId');
    alert('Logged out');
    window.location.reload(); // simple reset
  }

  getCartCount(items: any[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }
}