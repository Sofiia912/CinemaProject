import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  data = {
    FirstName: '',
    LastName: '',
    Email: '',
    Phone: '',
    Password: ''
  };
  confirm = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  get passwordsMatch(): boolean {
  return !! this.data.Password && this.data.Password === this.confirm;
}
  onSubmit() {
    this.error = '';
    this.auth.register(this.data).subscribe({
      next: () => this.router.navigate(['/login']),
      error: e => {
        const err = e.error;
        this.error = typeof err === 'string'
          ? err
          : err?.message || 'Не вдалося зареєструватися';
      }
    });
  }
}