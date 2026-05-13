import { Component } from '@angular/core';
import { CartService } from '../../services/cart';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CurrencyPipe } from '@angular/common';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent {

  shippingAddress: string = '';

  constructor(
    public cart: CartService,
    private api: ApiService,
    private router: Router,
    private auth: AuthService,
    private toast: ToastService
  ) {}

  placeOrder(form: any) {

    if (!this.auth.isLoggedIn()) {
      this.toast.show('You must be logged in to place an order', 'info');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.shippingAddress) {
      this.toast.show('Shipping address is required', 'error');
      return;
    }

    const items = this.cart.getItems().map(item => ({
      productId: item.id,
      quantity: item.quantity
    }));

    if (items.length === 0) {
      this.toast.show('Cart is empty', 'error');
      return;
    }

    const order = {
      shippingAddress: this.shippingAddress,
      items: items
    };

    this.api.checkout(order).subscribe({
      next: () => {
        this.toast.show('Order placed successfully!', 'success');
        this.cart.clearCart();
        form.resetForm();

        this.router.navigate(['/']);
      },
      error: () => {
        this.toast.show('Checkout failed', 'error');
      }
    });
  }
}
