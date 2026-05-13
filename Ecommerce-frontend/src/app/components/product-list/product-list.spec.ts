import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, firstValueFrom } from 'rxjs';
import { vi } from 'vitest';

import { ProductListComponent } from './product-list';

import { ApiService } from '../../services/api';
import { CartService } from '../../services/cart';
import { ToastService } from '../../services/toast';

describe('ProductListComponent', () => {

  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  let apiServiceMock: any;
  let cartServiceMock: any;
  let toastServiceMock: any;

  beforeEach(async () => {

    apiServiceMock = {
      getProducts: vi.fn().mockReturnValue(
        of([
          {
            id: 1,
            name: 'Laptop',
            price: 1000,
            imageUrl: 'test.jpg'
          }
        ])
      )
    };

    cartServiceMock = {
      addToCart: vi.fn()
    };

    toastServiceMock = {
      show: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products from API', async () => {

    const products = await firstValueFrom(component.products$);

    expect(products.length).toBe(1);

    expect(products[0].name).toBe('Laptop');

    expect(apiServiceMock.getProducts).toHaveBeenCalled();

  });

  it('should add product to cart', () => {

    const product = {
      id: 1,
      name: 'Laptop',
      price: 1000
    };

    component.addToCart(product);

    expect(cartServiceMock.addToCart).toHaveBeenCalledWith(product);

  });

  it('should show toast when adding product to cart', () => {

    const product = {
      id: 1,
      name: 'Laptop',
      price: 1000
    };

    component.addToCart(product);

    expect(toastServiceMock.show).toHaveBeenCalled();

  });

});