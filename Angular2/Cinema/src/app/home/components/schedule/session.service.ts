import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { SessionView, SessionDetail } from './sessions.type';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private apiUrl = 'http://localhost:5001/sessions';

  constructor(private http: HttpClient) {}

  getSessions(): Observable<SessionView[]> {
    return this.http.get<SessionView[]>(this.apiUrl).pipe(
      map(arr => arr.map(s => ({
        ...s,
        Price: Number((s as any).Price)
      })))
    );
  }

  getSessionsByMovie(movieId: number): Observable<SessionView[]> {
    return this.http.get<SessionView[]>(`${this.apiUrl}/movie/${movieId}`).pipe(
      map(arr => arr.map(s => ({
        ...s,
        Price: Number((s as any).Price)
      })))
    );
  }

  getSession(id: number): Observable<SessionDetail> {
    return this.http.get<SessionDetail>(`${this.apiUrl}/${id}`).pipe(
      map(s => ({
        ...s,
        Price:     Number((s as any).Price),
        PriceGood: Number((s as any).PriceGood),
        PriceLux:  Number((s as any).PriceLux)
      }))
    );
  }

  /** Видалити сеанс за ID */
  deleteSession(sessionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${sessionId}`);
  }
 createSession(payload: {
  MovieID: number;
  StartAt: string;
  HallID: number;
  Price: number;
  PriceGood: number;
  PriceLux: number;
}): Observable<{ SessionID: number; message: string }> {
  return this.http.post<{ SessionID: number; message: string }>(
    this.apiUrl,
    payload
  );
}

updateSession(
  sessionId: number,
  payload: {
    MovieID: number;
    StartAt: string;
    HallID: number;
    Price: number;
    PriceGood: number;
    PriceLux: number;
  }
): Observable<SessionView> {
  return this.http.put<SessionView>(`${this.apiUrl}/${sessionId}`, payload);
}
}