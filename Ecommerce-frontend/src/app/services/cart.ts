import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})

export class CartService {

  private items = new BehaviorSubject<CartItem[]>(this.loadCart());
  items$ = this.items.asObservable();

  private getCartKey(): string {
    const clientId = localStorage.getItem('clientId');
    return clientId ? `cart_${clientId}` : 'cart_guest';
  }

  private loadCart(): CartItem[] {
    const data = localStorage.getItem(this.getCartKey());
    return data ? JSON.parse(data) : [];
  }

  private saveCart(items: CartItem[]) {
    localStorage.setItem(this.getCartKey(), JSON.stringify(items));
  }

  getItems() {
    return this.items.value;
  }

  addToCart(product: any) {
    const current = this.items.value;
    const existing = current.find(p => p.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      current.push({ ...product, quantity: 1 });
    }

    this.items.next([...current]);
    this.saveCart(current);
  }

  removeFromCart(productId: number) {
    const updated = this.items.value.filter(p => p.id !== productId);
    this.items.next(updated);
    this.saveCart(updated);
  }

  clearCart() {
    this.items.next([]);
    localStorage.removeItem(this.getCartKey());
  }

  getTotal(): number {
    return this.items.value.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  getItemCount(): number {
    return this.items.value.reduce((sum, item) => sum + item.quantity, 0);
  }

  updateQuantity(productId: number, quantity: number) {
    const items = this.items.value;

    const item = items.find(p => p.id === productId);
    if (item) {
      item.quantity = quantity;
    }

    this.items.next([...items]);
    this.saveCart(items);
  }

  reloadCart() {
    const items = this.loadCart();
    this.items.next(items);
  }

  mergeGuestCartIntoUserCart() {
    const guestCart: CartItem[] = JSON.parse(localStorage.getItem('cart_guest') || '[]');

    if (guestCart.length === 0) return;

    const userCart = this.loadCart();
    const merged = [...userCart];

    guestCart.forEach((gItem: CartItem) => {
      const existing = merged.find(i => i.id === gItem.id);

      if (existing) {
        existing.quantity += gItem.quantity;
      } else {
        merged.push(gItem);
      }
    });

    this.items.next(merged);
    this.saveCart(merged);

    localStorage.removeItem('cart_guest');
  }
}
