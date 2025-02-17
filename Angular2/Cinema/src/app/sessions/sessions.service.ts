import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Session } from "./sessions.type";
@Injectable({
    providedIn: 'root'
  })
  export class SessionService {
    private apiUrl = 'http://localhost:5001/sessions'; 
  
    constructor(private http: HttpClient) {}

    // Get sessions by Movie ID
    getSessionsByMovie(MovieID: string): Observable<Session[]> {
      return this.http.get<Session[]>(`${this.apiUrl}/movie/${MovieID}`);
    }
  
    // Add a new session
    addSession(session: Session): Observable<Session> {
      return this.http.post<Session>(this.apiUrl, session);
    }
  
    // Edit an existing session
    editSession(session: Session): Observable<Session> {
      return this.http.put<Session>(`${this.apiUrl}/${session.SessionID}`, session);
    }
  
    // Delete a session by ID
    deleteSession(SessionID: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${SessionID}`);
    }
}