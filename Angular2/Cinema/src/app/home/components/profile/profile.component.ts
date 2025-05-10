import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { Booking, BookingService, SeatInfo } from '../../../services/booking.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [DatePipe]

})
export class ProfileComponent implements OnInit, OnDestroy {
  public authSvc    = inject(AuthService);
  public bookingSvc = inject(BookingService);
  private dp         = inject(DatePipe);

  public bookings: Booking[] = [];
  public loading  = true;
  public error    = '';

  private subs: Subscription[] = [];
  ngOnInit() {
    // Тільки бронювання: користувача беремо напряму з authSvc.user()
    const sub = this.bookingSvc.getMyBookings().subscribe({
      next: bs => {
        this.bookings = bs;
        this.loading  = false;
      },
      error: err => {
        console.error(err);
        this.error   = 'Не вдалося завантажити бронювання';
        this.loading = false;
      }
    });
    this.subs.push(sub);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  fmt(dt: string) {
    return this.dp.transform(dt, 'd MMMM y, HH:mm', 'uk');
  }

  canCancel(startAt: string): boolean {
    return new Date(startAt).getTime() - Date.now() > 5 * 3600_000;
  }

  cancel(id: number) {
    if (!confirm('Скасувати бронювання?')) return;
    this.loading = true;
    const sub = this.bookingSvc.deleteBooking(id).subscribe({
      next: () => {
        this.bookings = this.bookings.filter(b => b.BookingID !== id);
        this.loading  = false;
      },
      error: err => {
        console.error(err);
        alert('Не вдалося скасувати бронювання');
        this.loading = false;
      }
    });
    this.subs.push(sub);
  }

  formatSeats(seats: SeatInfo[]): string {
    return seats
      .map(s => `Ряд ${s.RowNumber}, місце ${s.SeatNumber} (${s.Type})`)
      .join('; ');
  }

  get user() {
    return this.authSvc.user();
  }
}