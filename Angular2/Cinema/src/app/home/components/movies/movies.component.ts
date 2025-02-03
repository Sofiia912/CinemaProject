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

}
