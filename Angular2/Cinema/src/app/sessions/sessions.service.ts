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
  
    getSessionsByMovie(MovieID: string): Observable<Session[]> {
      return this.http.get<Session[]>(`${this.apiUrl}/${MovieID}`);
    }
}