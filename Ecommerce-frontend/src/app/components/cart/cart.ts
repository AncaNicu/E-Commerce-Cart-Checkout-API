import { Component } from '@angular/core';
import { CartService } from '../../services/cart';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, RouterLink], 
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent {

  cartItems$: Observable<any[]>;

  constructor(private cart: CartService) {
    this.cartItems$ = this.cart.items$;
  }

  removeItem(productId: number) {
    this.cart.removeFromCart(productId);
  }

  getTotal(items: any[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  updateQuantity(productId: number, quantity: number) {
    this.cart.updateQuantity(productId, Number(quantity));
  }

  clearCart() {
    this.cart.clearCart();
  }
}
