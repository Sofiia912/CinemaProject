import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MoviesService } from '../movies/movies.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SessionService } from '../schedule/session.service';
import { MovieListItem } from '../movies/movies.type';
import { SessionView } from '../schedule/sessions.type';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [  CommonModule, FormsModule, ReactiveFormsModule,],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  providers: [MoviesService, SessionService ] 
})
export class SettingsComponent implements OnInit {
  movies: MovieListItem[] = [];

  showAddMovieForm = false;
  showEditMovieForm = false;
  showDeleteMovieForm = false;

  addMovieForm!: FormGroup;
  editMovieForm!: FormGroup;
  deleteId: number | null = null;
  section: 'movies' | 'sessions' = 'movies';
  sessions: SessionView[] = [];
  sessionForm: 'list' | 'add' | 'edit' = 'list';

  addSessionForm!: FormGroup;
  editSessionForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private moviesService: MoviesService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.initForms();
    this.loadMovies();
    this.initSessionForms();
    this.loadSessions();
  }

  private initForms() {
    this.addMovieForm = this.fb.group({
      Title: ['', Validators.required],
      ReleaseDate: ['', Validators.required],
      Genre: ['', Validators.required],
      PosterImg: ['', Validators.required],
      Director: ['', Validators.required],
      Description: ['', Validators.required],
      Duration: [0, [Validators.required, Validators.min(1)]],
      Language: ['', Validators.required]
    });

    this.editMovieForm = this.fb.group({
      MovieID: [null, Validators.required],
      Title: ['', Validators.required],
      ReleaseDate: ['', Validators.required],
      Genre: ['', Validators.required],
      PosterImg: ['', Validators.required],
      Director: ['', Validators.required],
      Description: ['', Validators.required],
      Duration: [0, [Validators.required, Validators.min(1)]],
      Language: ['', Validators.required]
    });
  }

  loadMovies() {
    this.showAddMovieForm = false;
    this.showEditMovieForm = false;
    this.showDeleteMovieForm = false;
    
    this.moviesService.getMoviesList()
      .subscribe({
        next: list => {
          this.movies = list.map(m => ({
            ...m,
            Genre: Array.isArray(m.Genre)
              ? m.Genre
              : (m.Genre as unknown as string).split(',').map(s => s.trim())
          }));
        },
        error: err => console.error('Не вдалося завантажити фільми', err)
      });
  }

  toggleForm(form: string) {
    this.showAddMovieForm = form === 'addMovie';
    this.showEditMovieForm = form === 'editMovie';
    this.showDeleteMovieForm = form === 'deleteMovie';
    if (form === 'addMovie') this.deleteId = null;
  }

  onAddMovie() {
    if (!this.addMovieForm.valid) return;
    const val = this.addMovieForm.value;
    const payload = {
      ...val,
      Genre: val.Genre.split(',').map((s: string) => s.trim())
    };
    this.moviesService.addMovie(payload).subscribe(() => {
      this.addMovieForm.reset();
      this.loadMovies();
    });
  }

  prefillEdit(m: MovieListItem) {
    this.toggleForm('editMovie');
    this.editMovieForm.patchValue({
      MovieID: m.MovieID,
      Title: m.Title,
      ReleaseDate: m.ReleaseDate.toString().slice(0,10),
      Genre: m.Genre.join(', '),
      PosterImg: m.PosterImg,
      Director: m.Director,
      Description: m.Description,
      Duration: m.Duration,
      Language: m.Language
    });
  }

  onEditMovie() {
    if (!this.editMovieForm.valid) return;
    const val = this.editMovieForm.value;
    const payload = {
      ...val,
      Genre: val.Genre.split(',').map((s: string) => s.trim())
    };
    this.moviesService.editMovie(payload).subscribe(() => {
      this.editMovieForm.reset();
      this.loadMovies();
    });
  }

  onDeleteMovie(id: number) {
    if (!confirm('Видалити цей фільм?')) return;
    this.moviesService.deleteMovie(id)
      .subscribe(() => this.loadMovies(),
                err => console.error(err));
  }
  
  private initSessionForms() {
   this.addSessionForm = this.fb.group({
      MovieID:   [null, Validators.required],
      StartAt:   ['', Validators.required],
      HallID:    [null, Validators.required],
      Price:     [0, [Validators.required, Validators.min(0)]],
      PriceGood: [0, [Validators.required, Validators.min(0)]],
      PriceLux:  [0, [Validators.required, Validators.min(0)]],
    });

    this.editSessionForm = this.fb.group({
      SessionID: [null, Validators.required],
      MovieID:   [null, Validators.required],
      StartAt:   ['', Validators.required],
      HallID:    [null, Validators.required],
      Price:     [0, [Validators.required, Validators.min(0)]],
      PriceGood: [0, [Validators.required, Validators.min(0)]],
      PriceLux:  [0, [Validators.required, Validators.min(0)]],
    });
  }

  loadSessions() {
    this.sessionService.getSessions().subscribe(list => (this.sessions = list));
  }

  toggleSection(sec: 'movies' | 'sessions') {
    this.section = sec;
    if (sec === 'sessions') this.loadSessions();
  }

  toggleSessionForm(form: 'list' | 'add' | 'edit') {
    this.sessionForm = form;
    if (form === 'list') this.loadSessions();
  }

  prefillEditSession(s: SessionView) {
    this.toggleSessionForm('edit');
    const dt = new Date(s.StartAt);
    const local = dt.toISOString().slice(0, 16);
    this.editSessionForm.patchValue({
      SessionID: s.SessionID,
      MovieID: (s as any).MovieID,
      StartAt: local,
      HallID: (s as any).HallID,
      Price: s.Price
    });
  }

  onAddSession() {
    if (!this.addSessionForm.valid) return;
    const val = this.addSessionForm.value;
    const [date, time] = val.StartAt.split('T');
    const StartAt = `${date} ${time}:00`;

    this.sessionService.createSession({
      MovieID: val.MovieID,
      StartAt,
      HallID: val.HallID,
      Price: val.Price,
      PriceGood: val.PriceGood,
      PriceLux: val.PriceLux
    }).subscribe(() => this.toggleSessionForm('list'));
  }

  onEditSession() {
    if (!this.editSessionForm.valid) return;
    const val = this.editSessionForm.value;
    const [date, time] = val.StartAt.split('T');
    const StartAt = `${date} ${time}:00`;

    this.sessionService.updateSession(val.SessionID, {
      MovieID: val.MovieID,
      StartAt,
      HallID: val.HallID,
      Price: val.Price,
      PriceGood: val.PriceGood,
      PriceLux: val.PriceLux
    }).subscribe(() => this.toggleSessionForm('list'));
  }

  onDeleteSession(id: number) {
    if (!confirm('Видалити цей сеанс?')) return;
    this.sessionService.deleteSession(id).subscribe(() => this.loadSessions());
  }
}