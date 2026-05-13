import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { RegisterUserComponent } from './register-user';

import { ApiService } from '../../services/api';
import { ToastService } from '../../services/toast';

describe('RegisterUserComponent', () => {

  let component: RegisterUserComponent;
  let fixture: ComponentFixture<RegisterUserComponent>;

  let apiServiceMock: any;
  let toastServiceMock: any;

  beforeEach(async () => {

    apiServiceMock = {
      register: vi.fn().mockReturnValue(of({}))
    };

    toastServiceMock = {
      show: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RegisterUserComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterUserComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if fields are empty', () => {

    component.name = '';
    component.email = '';
    component.password = '';
    component.confirmPassword = '';

    const formMock = {
      resetForm: vi.fn()
    };

    component.register(formMock);

    expect(toastServiceMock.show).toHaveBeenCalledWith(
      'All fields are required',
      'error'
    );

    expect(apiServiceMock.register).not.toHaveBeenCalled();
  });

  it('should show error if passwords do not match', () => {

    component.name = 'John';
    component.email = 'john@test.com';
    component.password = '1234';
    component.confirmPassword = '5678';

    const formMock = {
      resetForm: vi.fn()
    };

    component.register(formMock);

    expect(toastServiceMock.show).toHaveBeenCalledWith(
      'Passwords do not match',
      'error'
    );

    expect(apiServiceMock.register).not.toHaveBeenCalled();
  });

  it('should register successfully', () => {

    component.name = 'John';
    component.email = 'john@test.com';
    component.password = '1234';
    component.confirmPassword = '1234';

    const formMock = {
      resetForm: vi.fn()
    };

    component.register(formMock);

    expect(apiServiceMock.register).toHaveBeenCalled();

    expect(toastServiceMock.show).toHaveBeenCalledWith(
      'Registration successful!',
      'success'
    );

    expect(formMock.resetForm).toHaveBeenCalled();
  });

  it('should show error if registration fails', () => {

    apiServiceMock.register.mockReturnValue(
      throwError(() => new Error('Registration failed'))
    );

    component.name = 'John';
    component.email = 'john@test.com';
    component.password = '1234';
    component.confirmPassword = '1234';

    const formMock = {
      resetForm: vi.fn()
    };

    component.register(formMock);

    expect(toastServiceMock.show).toHaveBeenCalledWith(
      'Registration failed',
      'error'
    );
  });

});