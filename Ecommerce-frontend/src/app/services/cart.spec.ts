import { TestBed } from '@angular/core/testing';

import { CartService } from './cart';

describe('CartService', () => {

  let service: CartService;

  beforeEach(() => {

    localStorage.clear();

    TestBed.configureTestingModule({});

    service = TestBed.inject(CartService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should add product to cart', () => {

    const product = {
      id: 1,
      name: 'Laptop',
      price: 1000
    };

    service.addToCart(product);

    const items = service.getItems();

    expect(items.length).toBe(1);

    expect(items[0].name).toBe('Laptop');

    expect(items[0].quantity).toBe(1);
  });

  it('should increase quantity if product already exists', () => {

    const product = {
      id: 1,
      name: 'Laptop',
      price: 1000
    };

    service.addToCart(product);
    service.addToCart(product);

    const items = service.getItems();

    expect(items.length).toBe(1);

    expect(items[0].quantity).toBe(2);
  });

  it('should remove item from cart', () => {

    const product = {
      id: 1,
      name: 'Laptop',
      price: 1000
    };

    service.addToCart(product);

    service.removeFromCart(1);

    expect(service.getItems().length).toBe(0);
  });

  it('should clear cart', () => {

    service.addToCart({
      id: 1,
      name: 'Laptop',
      price: 1000
    });

    service.clearCart();

    expect(service.getItems().length).toBe(0);
  });

  it('should calculate total correctly', () => {

    service.addToCart({
      id: 1,
      name: 'Laptop',
      price: 1000
    });

    service.addToCart({
      id: 2,
      name: 'Mouse',
      price: 100
    });

    expect(service.getTotal()).toBe(1100);
  });

  it('should update quantity correctly', () => {

    service.addToCart({
      id: 1,
      name: 'Laptop',
      price: 1000
    });

    service.updateQuantity(1, 5);

    const item = service.getItems()[0];

    expect(item.quantity).toBe(5);
  });

  it('should calculate item count correctly', () => {

    service.addToCart({
      id: 1,
      name: 'Laptop',
      price: 1000
    });

    service.addToCart({
      id: 2,
      name: 'Mouse',
      price: 100
    });

    service.updateQuantity(2, 3);

    expect(service.getItemCount()).toBe(4);
  });

  it('should save cart in localStorage', () => {

    service.addToCart({
      id: 1,
      name: 'Laptop',
      price: 1000
    });

    const saved = localStorage.getItem('cart_guest');

    expect(saved).toContain('Laptop');
  });

  it('should reload cart from localStorage', () => {

    localStorage.setItem(
      'cart_guest',
      JSON.stringify([
        {
          id: 1,
          name: 'Laptop',
          price: 1000,
          quantity: 2
        }
      ])
    );

    service.reloadCart();

    const items = service.getItems();

    expect(items.length).toBe(1);

    expect(items[0].quantity).toBe(2);
  });

});