import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MoviesService } from '../home/components/movies/movies.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SessionService } from '../sessions/sessions.service';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ HttpClientModule,  CommonModule, FormsModule, ReactiveFormsModule,],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  providers: [MoviesService, SessionService ] 
})
export class SettingsComponent implements OnInit {
  showAddMovieForm = false;
  showEditMovieForm = false;
  showDeleteMovieForm = false;

  showAddSessionForm = false;
  showDeleteSessionForm = false;

  // Movie forms
  addMovieForm!: FormGroup;
  editMovieForm!: FormGroup;

  // Session forms
  addSessionForm!: FormGroup;

  deleteId: number | null = null;

  constructor(private fb: FormBuilder, private moviesService: MoviesService, private sessionsService: SessionService) {}

  ngOnInit() {
    // Movie add/edit forms
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

    // Session add/edit forms
    this.addSessionForm = this.fb.group({
      MovieID: [null, Validators.required],
      Date: ['', Validators.required],
      Time: ['', Validators.required],
      Hall: ['', Validators.required],
      Price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  toggleForm(formType: string) {
    this.showAddMovieForm = formType === 'addMovie';
    this.showEditMovieForm = formType === 'editMovie';
    this.showDeleteMovieForm = formType === 'deleteMovie';
    this.showAddSessionForm = formType === 'addSession';
    this.showDeleteSessionForm = formType === 'deleteSession';
  }

  // Movie actions
  onAddMovie() {
    if (this.addMovieForm.valid) {
      this.moviesService.addMovie(this.addMovieForm.value).subscribe(() => {
        alert('Фільм додано!');
        this.addMovieForm.reset();
      });
    }
  }

  onEditMovie() {
    if (this.editMovieForm.valid) {
      this.moviesService.editMovie(this.editMovieForm.value).subscribe(() => {
        alert('Фільм оновлено!');
        this.editMovieForm.reset();
      });
    }
  }

  onDeleteMovie() {
    if (this.deleteId) {
      this.moviesService.deleteMovie(this.deleteId).subscribe(() => {
        alert('Фільм видалено!');
        this.deleteId = null;
      });
    }
  }

  // Session actions
  onAddSession() {
    if (this.addSessionForm.valid) {
      this.sessionsService.addSession(this.addSessionForm.value).subscribe(() => {
        alert('Сеанс додано!');
        this.addSessionForm.reset();
      });
    }
  }

  onDeleteSession() {
    if (this.deleteId) {
      this.sessionsService.deleteSession(this.deleteId).subscribe(() => {
        alert('Сеанс видалено!');
        this.deleteId = null;
      });
    }
  }
}
