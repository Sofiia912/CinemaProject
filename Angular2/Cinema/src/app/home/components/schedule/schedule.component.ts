import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from './session.service';
import { SessionView } from './sessions.type';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit {
  dates:        string[]      = [];
  selectedDate: string        = '';
  sessions:     SessionView[] = [];

  constructor(
    private sessionService: SessionService,
    private router:         Router
  ) {}

  ngOnInit() {
    this.initDatesWindow();
    this.loadSessions();
  }

  private initDatesWindow() {
    const today = new Date();
    this.dates = [];
    for (let offset = 0; offset < 3; offset++) {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      this.dates.push(this.toYMD(d));
    }
    this.selectedDate = this.dates[0];
  }

  private loadSessions() {
    const now = Date.now();
    this.sessionService.getSessions().subscribe({
      next: data => {
        this.sessions = data.filter(s => new Date(s.StartAt).getTime() > now);
      },
      error: err => console.error('Error loading sessions:', err)
    });
  }
  private toYMD(d: Date): string {
    const y  = d.getFullYear();
    const m  = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  sessionsForSelected(): SessionView[] {
    return this.sessions
      .filter(s => this.toYMD(new Date(s.StartAt)) === this.selectedDate)
      .sort((a, b) => new Date(a.StartAt).getTime() - new Date(b.StartAt).getTime());
  }

  selectDate(d: string) {
    this.selectedDate = d;
  }

  /** Перехід на бронювання */
  book(s: SessionView) {
    this.router.navigate(['/booking', s.SessionID]);
  }
  hasPrev(): boolean {
    const todayYMD = this.toYMD(new Date());
    return this.dates[0] !== todayYMD;
  }

  prevDate() {
    if (!this.hasPrev()) return;
    const first = new Date(this.dates[0]);
    first.setDate(first.getDate() - 1);
    this.dates.pop();
    this.dates.unshift(this.toYMD(first));
    this.selectedDate = this.dates[0];
  }

  nextDate() {
    const last = new Date(this.dates[this.dates.length - 1]);
    last.setDate(last.getDate() + 1);
    this.dates.shift();
    this.dates.push(this.toYMD(last));
    this.selectedDate = this.dates[0];
  }
}