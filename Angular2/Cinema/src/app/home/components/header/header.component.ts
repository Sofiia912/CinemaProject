import { Component } from '@angular/core';
import { RouterLink  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MoviesService } from '../movies/movies.service';
import { MovieListItem } from '../movies/movies.type';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, HttpClientModule, CommonModule, FormsModule,],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [MoviesService]
})
export class HeaderComponent {
  movies: MovieListItem[] = [];  // Масив для результатів пошуку
  inputValue: string = '';
  
  constructor(private moviesService: MoviesService) {}

  handleInputChange() {
    const searchTerm = this.inputValue.trim();
    if (searchTerm.length > 0) { 
      this.moviesService.getMovieByName(searchTerm).subscribe(
        (movies) => {
          this.movies = movies;
        },
        (error) => {
          console.error('Помилка пошуку:', error);
          this.movies = [];
        }
      );
    } else {
      this.movies = [];
    } 
  }
  onMovieSelect() {
    this.movies = [];
    this.inputValue = '';  // Очистити поле вводу
  }
  
}

//  handleInputChange(){
//   this.moviesService.getMovieByName(this.inputValue).subscribe((movies) => {
//     this.movies = movies
//       });
//  }
// }
