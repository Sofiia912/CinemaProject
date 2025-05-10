import { Component, inject } from '@angular/core';
import { Router, RouterLink  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MoviesService } from '../movies/movies.service';
import { MovieListItem } from '../movies/movies.type';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [MoviesService]
})
export class HeaderComponent {
  movies: MovieListItem[] = [];
  inputValue = '';

  public auth = inject(AuthService);
  public router = inject(Router);
  private moviesService = inject(MoviesService);

  handleInputChange() {
    const term = this.inputValue.trim();
    if (!term) {
      this.movies = [];
      return;
    }
    forkJoin({
      byName: this.moviesService.getMovieByName(term),
      byKeyword: this.moviesService.getMovieByKeyWord(term)
    }).subscribe({
      next: ({ byName, byKeyword }) => {
        const combined = [...byName, ...byKeyword];
        this.movies = combined.filter(
          (item, idx, arr) =>
            arr.findIndex(x => x.MovieID === item.MovieID) === idx
        );
      },
      error: () => (this.movies = [])
    });
  }

  goToMovie(id: number) {
    this.router.navigate(['/movie', id]);
    this.movies = [];
    this.inputValue = '';
  }

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }
}