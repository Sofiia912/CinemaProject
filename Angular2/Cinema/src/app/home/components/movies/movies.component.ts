import { Component } from '@angular/core';
import { MovieListItem } from './movies.type';
import { MoviesService } from './movies.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
  providers: [MoviesService]
})
export class MoviesComponent {
  movies: MovieListItem[] = [];

  constructor(MoviesService: MoviesService) {
    MoviesService.getMoviesList().subscribe((movies) => {
      this.movies = movies;
    })
  }
  // constructor(private moviesService: MoviesService) {}

  // ngOnInit(): void {
  //   this.fetchMovies(); // Завантаження списку фільмів під час ініціалізації
  // }

  // fetchMovies(): void {
  //   this.moviesService.getMoviesList().subscribe({
  //     next: (data: MovieListItem[]) => {
  //       this.movies = data; // Отриманий масив присвоюється змінній `movies`
  //     },
  //     error: (error: any) => {
  //       console.error('Помилка при отриманні списку фільмів:', error);
  //     },
  //   });
  // }
}
