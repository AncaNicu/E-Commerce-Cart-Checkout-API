import { Component } from '@angular/core';
import { ApiService } from '../../services/api';
import { CartService } from '../../services/cart';
import { Observable } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent {

  products$: Observable<any[]>;

  constructor(
    private api: ApiService,
    private cart: CartService,
    private toast: ToastService
  ) {
    this.products$ = this.api.getProducts();
  }

  addToCart(product: any) {
    this.cart.addToCart(product);
    this.toast.show('Product added to the cart', 'info');
  }
}
