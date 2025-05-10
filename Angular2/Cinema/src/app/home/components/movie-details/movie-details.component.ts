import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../movies/movies.service';
import { MovieListItem } from '../movies/movies.type';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SessionService } from '../schedule/session.service';
import { SessionView } from '../schedule/sessions.type';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterLink, ],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss',
  providers: [MoviesService]
})
export class MovieDetailsComponent implements OnInit {
  movie:       MovieListItem | null = null;
  otherMovies: MovieListItem[]      = [];
  sessions:    SessionView[]        = [];

  // Для вкладок дат
  dates:        string[] = [];
  selectedDate: string   = '';

  constructor(
    private moviesService:  MoviesService,
    private sessionService: SessionService,
    private route:          ActivatedRoute
  ) {}

  ngOnInit() {
    this.initDatesWindow();
    this.route.paramMap.subscribe(params => {
      const id = params.get('MovieID');
      if (id) {
        this.loadMovieDetails(id);
        this.loadOtherMovies();
        this.loadSessions(id);
      }
    });
  }

  /** Ініціалізуємо початкове вікно з 3 дат */
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

  /** Завантажуємо деталі фільму */
  private loadMovieDetails(MovieID: string) {
    this.moviesService.getMovieById(MovieID).subscribe({
      next: movie => this.movie = movie,
      error: ()     => this.movie = null
    });
  }

  /** Завантажуємо інші випадкові фільми */
  private loadOtherMovies() {
    this.moviesService.getMoviesList().subscribe({
      next: movies => this.otherMovies = this.getRandomMovies(movies, 5)
    });
  }

  /** Завантажуємо сеанси й відсіюємо минулі */
  private loadSessions(MovieID: string) {
    const id  = +MovieID;
    const now = Date.now();
    this.sessionService.getSessionsByMovie(id).subscribe({
      next: sessions => {
        this.sessions = sessions.filter(s => new Date(s.StartAt).getTime() > now);
      },
      error: err => console.error('Помилка завантаження сеансів:', err)
    });
  }

  /** Перетворює Date → 'YYYY-MM-DD' */
  private toYMD(d: Date): string {
    const y  = d.getFullYear();
    const m  = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  /** Повертає сеанси для обраної дати */
  sessionsForSelected(): SessionView[] {
    return this.sessions
      .filter(s => this.toYMD(new Date(s.StartAt)) === this.selectedDate)
      .sort((a, b) => new Date(a.StartAt).getTime() - new Date(b.StartAt).getTime());
  }

  /** Обробник вибору дати */
  selectDate(d: string) {
    this.selectedDate = d;
  }

  /** Чи є попередня дата (не раніше сьогодні) */
  hasPrev(): boolean {
    const todayYMD = this.toYMD(new Date());
    return this.dates[0] !== todayYMD;
  }

  /** Горнути вліво: додати нову дату перед поточним вікном */
  prevDate() {
    if (!this.hasPrev()) return;
    const first = new Date(this.dates[0]);
    first.setDate(first.getDate() - 1);
    this.dates.pop();                  // викидаємо останню
    this.dates.unshift(this.toYMD(first)); // додаємо нову спереду
    this.selectedDate = this.dates[0];
  }

  /** Горнути вправо: додати нову дату після поточного вікна */
  nextDate() {
    const last = new Date(this.dates[this.dates.length - 1]);
    last.setDate(last.getDate() + 1);
    this.dates.shift();                // викидаємо першу
    this.dates.push(this.toYMD(last)); // додаємо нову в кінець
    this.selectedDate = this.dates[0];
  }

  /** Навігація на бронювання (за потребою) */
  book(s: SessionView) {
    // this.router.navigate(['/booking', s.SessionID]);
  }

  /** Випадковий набір фільмів */
  private getRandomMovies(arr: MovieListItem[], count: number) {
    return arr.sort(() => 0.5 - Math.random()).slice(0, count);
  }
}