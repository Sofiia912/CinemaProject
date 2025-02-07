import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Session } from './sessions.type';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from './sessions.service';


@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss'
})
export class SessionsComponent {
  session: Session | null = null;

  constructor(private route: ActivatedRoute, private sessionService: SessionService) {}

  ngOnInit() {
    const SessionID = this.route.snapshot.paramMap.get('SessionID');
    if (SessionID) {
      this.sessionService.getSessionsByMovie(SessionID).subscribe(
        (session) => {
          this.session = session[0]; // Отримуємо перший збіг (сеанс)
        },
        (error) => {
          console.error('Помилка завантаження сеансу:', error);
        }
      );
    }
  }
  // sessions: Session[] = [];

  // constructor(sessions: Sessions) {
  //   Session.getSessionsList().subscribe((sessions) => {
  //     this.sessions = sessions;
  //   })
  // }
}
