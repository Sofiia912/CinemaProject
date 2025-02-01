import { Component } from '@angular/core';
import { MoviesComponent } from './components/movies/movies.component';
import { HttpClientModule } from '@angular/common/http';
// import { MovieDetailsComponent } from "../movie-details/movie-details.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MoviesComponent, HttpClientModule, ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
