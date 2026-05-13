import { Component } from '@angular/core';
import { ApiService } from '../../services/api';
import { CartService } from '../../services/cart';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private cart: CartService,
    private toast: ToastService
  ) {}

  login(form: any) {
    if (!this.email || !this.password) {
      return;
    }

    const data = {
      email: this.email,
      password: this.password
    };

    this.api.login(data).subscribe({
      next: (res) => {
        //store token, name and id
        localStorage.setItem('token', res.token);
        localStorage.setItem('clientId', res.clientId.toString());
        localStorage.setItem('name', res.name);

        this.cart.mergeGuestCartIntoUserCart();
        this.cart.reloadCart();

        this.toast.show('Login successful!', 'success');
        form.resetForm();

        this.router.navigate(['/']);
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Invalid email or password', 'error');
      }
    });
  }

}
