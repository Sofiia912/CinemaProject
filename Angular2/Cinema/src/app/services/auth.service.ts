import { Injectable, signal } from '@angular/core';
import { HttpClient }          from '@angular/common/http';
import { Router }              from '@angular/router';
import { tap }                 from 'rxjs/operators';

export interface User {
  UserID:    number;
  FirstName: string;
  LastName:  string;
  Email:     string;
  Role:      'user' | 'admin';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  token = signal<string | null>(null);
  user  = signal<User | null>(null);

  private api = 'http://localhost:5001';

  constructor(private http: HttpClient, private router: Router) {
    // Якщо в localStorage є токен — підхоплюємо його і відновлюємо профіль
    if (typeof window !== 'undefined') {
      const tk = localStorage.getItem('token');
      if (tk) {
        this.token.set(tk);
        this.fetchProfile();
      }
    }
  }

  /** Перевіряє токен і завантажує дані користувача */
 private fetchProfile() {
  this.http
    .get<User>(`${this.api}/user/me`, {
      headers: { Authorization: `Bearer ${this.token()}` }
    })
    .subscribe({
      next: u => this.user.set(u),
      error: err => {
        console.error('Не вдалося завантажити профіль:', err);
      }
    });
}

  isLoggedIn(): boolean {
    return !!this.token();
  }

  login(email: string, password: string) {
    return this.http
      .post<{ token: string; user: User }>(
        `${this.api}/user/login`,
        { Email: email, Password: password }
      )
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          this.token.set(res.token);
          this.user.set(res.user);
        })
      );
  }

  register(data: { FirstName: string; LastName: string; Email: string; Phone: string; Password: string }) {
    return this.http.post<{ userId: number }>(
      `${this.api}/user/register`,
      data
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.token.set(null);
    this.user.set(null);
    this.router.navigate(['/login']);
  }
}
