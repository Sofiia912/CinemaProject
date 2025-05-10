import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  private returnUrl = '/profile';

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile';
  }
  onSubmit() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl),
    error: e => {
          // якщо бекенд повертає { error: "текст" }
          if (e.error && typeof e.error === 'string') {
            this.error = e.error;
          }
          // або { message: "текст" }
          else if (e.error && e.error.message) {
            this.error = e.error.message;
          }
          else {
            this.error = 'Не вдалося увійти';
          }
        }
    });
  }
}