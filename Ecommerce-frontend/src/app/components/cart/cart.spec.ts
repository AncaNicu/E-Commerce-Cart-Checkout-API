import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { provideRouter } from '@angular/router';

import { CartComponent } from './cart';

import { CartService } from '../../services/cart';

describe('CartComponent', () => {

  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  let cartServiceMock: any;

  beforeEach(async () => {

    cartServiceMock = {

      items$: of([
        {
          id: 1,
          name: 'Laptop',
          price: 1000,
          quantity: 2
        }
      ]),

      removeFromCart: vi.fn(),

      updateQuantity: vi.fn(),

      clearCart: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: cartServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total correctly', () => {

    const items = [
      {
        price: 1000,
        quantity: 2
      },
      {
        price: 100,
        quantity: 3
      }
    ];

    expect(component.getTotal(items)).toBe(2300);
  });

  it('should remove item', () => {

    component.removeItem(1);

    expect(cartServiceMock.removeFromCart).toHaveBeenCalledWith(1);
  });

  it('should update quantity', () => {

    component.updateQuantity(1, 5);

    expect(cartServiceMock.updateQuantity).toHaveBeenCalledWith(1, 5);
  });

  it('should clear cart', () => {

    component.clearCart();

    expect(cartServiceMock.clearCart).toHaveBeenCalled();
  });

});