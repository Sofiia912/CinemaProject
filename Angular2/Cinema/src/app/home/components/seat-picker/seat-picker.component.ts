import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { SeatService, Seat } from '../../../services/seat.service';
import { BookingService } from '../../../services/booking.service';
import { SessionService } from '../schedule/session.service';
import { SessionDetail } from '../schedule/sessions.type';

@Component({
  selector: 'app-seat-picker',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './seat-picker.component.html',
  styleUrl: './seat-picker.component.scss'
})
export class SeatPickerComponent implements OnInit {
  tickets: { label: string; price: number; rate: 'GOOD'|'SUPER LUX' }[] = [];
  total = 0;

  sessionId!: number;
  sessionInfo!: SessionDetail;
  seats: Seat[] = [];
  selected: number[] = [];

  staticCinemaAddress = `Львів, ТРЦ "Victoria Gardens"`;
  private route          = inject(ActivatedRoute);
  private sessionService = inject(SessionService);
  private seatService    = inject(SeatService);
  private bookingService = inject(BookingService);
  private router         = inject(Router);

  ngOnInit() {
    this.sessionId = +this.route.snapshot.paramMap.get('sessionId')!;
    //  Завантажуємо деталі сеансу
    this.sessionService.getSession(this.sessionId).subscribe(info => {
      this.sessionInfo = info;
      this.updateTickets();
    });
    // Завантажуємо місця
    this.seatService.getSeats(this.sessionId).subscribe(data => {
      this.seats = data;
      this.updateTickets();
    });
  }

  toggle(seat: Seat) {
    if (seat.isBooked) return;
    
    const idx = this.selected.indexOf(seat.SeatID);
    if (idx > -1) {
      // Видаляємо місце із вибраних
      this.selected.splice(idx, 1);
    } else {
      // Додаємо місце до вибраних
      this.selected.push(seat.SeatID);
    }
    
    this.updateTickets();
  }

  /** Видаляємо місце з кошика */
  remove(id: number) {
    this.selected = this.selected.filter(x => x !== id);
    this.updateTickets();
  }

  groupByRow() {
    const map = new Map<number, Seat[]>();
    this.seats
      .sort((a, b) => a.RowNumber - b.RowNumber || a.SeatNumber - b.SeatNumber)
      .forEach(s => {
        if (!map.has(s.RowNumber)) map.set(s.RowNumber, []);
        map.get(s.RowNumber)!.push(s);
      });
    return Array.from(map.entries()).map(([row, seats]) => ({ row, seats }));
  }

  /** Обчислюємо кінець сеансу */
  endTime(start: string, duration: number): string {
    const [h, m] = start.split(':').map(Number);
    const dt = new Date();
    dt.setHours(h, m + duration);
    return dt.toTimeString().slice(0,5);
  }

  private updateTickets() {
    if (!this.sessionInfo || !this.seats.length) {
      this.tickets = [];
      this.total = 0;
      return;
    }
    
    this.tickets = this.selected.map(id => {
      const seat = this.seats.find(s => s.SeatID === id)!;
      const isLux = this.isLuxSeat(seat.RowNumber);
      
      return {
        label: `Ряд ${seat.RowNumber}, місце ${seat.SeatNumber}`,
        price: isLux ? this.sessionInfo.PriceLux : this.sessionInfo.PriceGood,
        rate: isLux ? 'SUPER LUX' : 'GOOD'
      };
    });
    
    // Обчислюємо загальну суму
    this.total = this.tickets.reduce((sum, t) => sum + t.price, 0);
  }

  confirm() {
    if (!this.selected.length) return;

    this.bookingService
      .bookSeats(this.sessionId, this.selected)
      .subscribe({
        next: () => {
          // виводимо коротке повідомлення
          alert('Бронювання успішне!');
          // перекидаємо на профіль
          this.router.navigate(['/profile']);
        },
        error: err => {
          if (err.status === 409) {
            alert('Деякі місця вже зайняті — оновлюємо…');
            this.refreshSeats();
          } else {
            console.error(err);
            alert('Сталася помилка, спробуйте пізніше');
          }
        }
      });
  }


/** Завантажуємо місця і оновлюємо tickets/total */
private refreshSeats() {
  this.seatService.getSeats(this.sessionId).subscribe(seats => {
    this.seats = seats;
    this.selected = [];
    this.updateTickets();
  });
}
  /** Визначає максимальний номер ряду в залі */
  getMaxRow(): number {
    if (!this.seats.length) return 0;
    return Math.max(...this.seats.map(seat => seat.RowNumber));
  }
  
  /** Визначає, чи є місце люкс-місцем (два останні ряди) */
  isLuxSeat(rowNumber: number): boolean {
    const maxRow = this.getMaxRow();
    return rowNumber >= maxRow - 1;
  }
}
