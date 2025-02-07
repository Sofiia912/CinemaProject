import { Component } from '@angular/core';
import { MoviesService } from '../home/components/movies/movies.service';
import { MovieListItem } from '../home/components/movies/movies.type';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterLink, ],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss',
  providers: [MoviesService]
})
export class MovieDetailsComponent {
  movie: MovieListItem | null = null;
  otherMovies: MovieListItem[] = [];

  constructor(
    private moviesService: MoviesService, 
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const MovieID = params.get('MovieID');
      if (MovieID) {
        this.loadMovieDetails(MovieID);
        this.loadOtherMovies();
      }
    });
  }
  
  loadMovieDetails(MovieID: string) {
    this.moviesService.getMovieById(MovieID).subscribe(
      (movie) => {
        this.movie = movie;
      },
      (error) => {
        console.error('Помилка завантаження фільму:', error);
        this.movie = null;
      }
    );
  }
  loadOtherMovies() {
    this.moviesService.getMoviesList().subscribe(
      (movies) => {
        this.otherMovies = this.getRandomMovies(movies, 5);
      },
      (error) => {
        console.error('Помилка завантаження фільмів:', error);
      }
    );
  }

  getRandomMovies(movies: MovieListItem[], count: number): MovieListItem[] {
    return movies.sort(() => 0.5 - Math.random()).slice(0, count);
  }
}


