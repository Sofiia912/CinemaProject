import { Injectable, inject } from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable }         from 'rxjs';

export interface Seat {
  SeatID:     number;
  RowNumber:  number;
  SeatNumber: number;
  isBooked:   boolean;
}

@Injectable({ providedIn: 'root' })
export class SeatService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private api  = 'http://localhost:5001/seats';

  getSeats(sessionId: number): Observable<Seat[]> {
     return this.http.get<Seat[]>(`${this.api}/${sessionId}`);
  }
}
