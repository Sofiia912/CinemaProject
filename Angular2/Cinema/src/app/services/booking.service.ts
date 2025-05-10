import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface SeatInfo {
  SeatID:     number;
  RowNumber:  number;
  SeatNumber: number;
  Type:       'GOOD' | 'SUPER_LUX';
}

export interface Booking {
  BookingID: number;
  SessionID: number;
  MovieID: number;
  MovieTitle: string;
  PosterImg: string;
  StartAt: string;         
  Seats: SeatInfo[];
  TotalPrice: number;
  HallID: number; 
  CreatedAt: string;         
}
@Injectable({ providedIn: 'root' })
  
export class BookingService {
  private apiUrl = 'http://localhost:5001/bookings';

  constructor(private http: HttpClient) { }
  
  bookSeats(sessionId: number, seats: number[]): Observable<{BookingID:number, TotalPrice:number}> {
    return this.http.post<{
      BookingID: number;
      TotalPrice: number;
      message: string;
    }>(
      this.apiUrl,
      { SessionID: sessionId, Seats: seats }
    ).pipe(
      map(res => ({ BookingID: res.BookingID, TotalPrice: res.TotalPrice }))
    );
  }
  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  deleteBooking(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}