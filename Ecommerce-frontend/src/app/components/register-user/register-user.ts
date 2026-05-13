import { Component } from '@angular/core';
import { ApiService } from '../../services/api';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register-user.html',
  styleUrls: ['./register-user.css']
})
export class RegisterUserComponent {

  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private api: ApiService,
    private toast: ToastService
) {}

  register(form: any) {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.toast.show('All fields are required', 'error');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toast.show('Passwords do not match', 'error');
      return;
    }

    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    };

    this.api.register(data).subscribe({
      next: () => {
        this.toast.show('Registration successful!', 'success');
        form.resetForm();
      },
      error: () => {
        this.toast.show('There is already a user with the same email', 'error');
      }
    });
  }
}
