import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { provideRouter, Router } from '@angular/router';

import { CheckoutComponent } from './checkout';

import { CartService } from '../../services/cart';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';

describe('CheckoutComponent', () => {

  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

  let cartServiceMock: any;
  let apiServiceMock: any;
  let authServiceMock: any;
  let toastServiceMock: any;

  let router: Router;

  beforeEach(async () => {

  cartServiceMock = {

    getItems: vi.fn().mockReturnValue([
      {
        id: 1,
        name: 'Laptop',
        price: 1000,
        quantity: 2
      }
    ]),

    getTotal: vi.fn().mockReturnValue(2000),

    clearCart: vi.fn()
  };

    apiServiceMock = {
      checkout: vi.fn().mockReturnValue(of({}))
    };

    authServiceMock = {
      isLoggedIn: vi.fn().mockReturnValue(true)
    };

    toastServiceMock = {
      show: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: cartServiceMock },
        { provide: ApiService, useValue: apiServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);

    component = fixture.componentInstance;

    router = TestBed.inject(Router);

    vi.spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to login if user is not logged in', () => {

    authServiceMock.isLoggedIn.mockReturnValue(false);

    const formMock = {
      resetForm: vi.fn()
    };

    component.placeOrder(formMock);

    expect(toastServiceMock.show).toHaveBeenCalledWith(
      'You must be logged in to place an order',
      'info'
    );

    expect(router.navigate).toHaveBeenCalledWith(['/login']);

    expect(apiServiceMock.checkout).not.toHaveBeenCalled();
  });

  it('should show error if shipping address is empty', () => {

    component.shippingAddress = '';

    const formMock = {
      resetForm: vi.fn()
    };

    component.placeOrder(formMock);

    expect(toastServiceMock.show).toHaveBeenCalledWith(
      'Shipping address is required',
      'error'
    );

    expect(apiServiceMock.checkout).not.toHaveBeenCalled();
  });

  it('should show error if cart is empty', () => {

    cartServiceMock.getItems.mockReturnValue([]);

    component.shippingAddress = 'Test Address';

    const formMock = {
      resetForm: vi.fn()
    };

    component.placeOrder(formMock);

    expect(toastServiceMock.show).toHaveBeenCalledWith(
      'Cart is empty',
      'error'
    );

    expect(apiServiceMock.checkout).not.toHaveBeenCalled();
  });

  it('should place order successfully', () => {

    component.shippingAddress = 'Test Address';

    const formMock = {
      resetForm: vi.fn()
    };

    component.placeOrder(formMock);

    expect(apiServiceMock.checkout).toHaveBeenCalled();

    expect(cartServiceMock.clearCart).toHaveBeenCalled();

    expect(formMock.resetForm).toHaveBeenCalled();

    expect(router.navigate).toHaveBeenCalledWith(['/']);

    expect(toastServiceMock.show).toHaveBeenCalledWith(
      'Order placed successfully!',
      'success'
    );
  });

  it('should show error if checkout fails', () => {

    apiServiceMock.checkout.mockReturnValue(
      throwError(() => new Error('Checkout failed'))
    );

    component.shippingAddress = 'Test Address';

    const formMock = {
      resetForm: vi.fn()
    };

    component.placeOrder(formMock);

    expect(toastServiceMock.show).toHaveBeenCalledWith(
      'Checkout failed',
      'error'
    );
  });

});