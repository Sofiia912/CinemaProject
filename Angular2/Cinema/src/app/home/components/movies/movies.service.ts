import { Injectable } from "@angular/core";
import { MovieListItem } from "./movies.type";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class MoviesService {

    constructor(private httpClient: HttpClient){ }

    private apiUrl = 'http://localhost:5001/movies';
    
    //Запит на отримання всіх фільмів з сервера
    getMoviesList(): Observable<MovieListItem[]> {
        return this.httpClient.get<MovieListItem[]>(
            `${this.apiUrl}`
        );
    }
    
    //Запит на отримання фільмів за рядком пошуку
      getMovieByName(term: string): Observable<MovieListItem[]> {
    return this.httpClient
      .get<MovieListItem[]>(`${this.apiUrl}/search/${term}`)
      .pipe(
        catchError(err => {
          // якщо 404 або будь-яка інша помилка — повертаємо порожній масив
          console.warn('Помилка пошуку за назвою:', err.message || err.status);
          return of([]);
        })
      );
  }
    getMovieByKeyWord(term: string): Observable<MovieListItem[]> {
    return this.httpClient
      .get<MovieListItem[]>(`${this.apiUrl}/search/keyword/${term}`)
      .pipe(
        catchError(err => {
          console.warn('Помилка пошуку за ключовим словом:', err.message || err.status);
          return of([]);
        })
      );
  }


    //Запит на отримання деталей фільму за ID
    getMovieById(MovieID: string): Observable<MovieListItem> {
        return this.httpClient.get<MovieListItem>(`${this.apiUrl}/${MovieID}`);
    } 
    
    addMovie(movie: Omit<MovieListItem, 'MovieID'>): Observable<MovieListItem> {
        return this.httpClient.post<MovieListItem>(this.apiUrl, movie);
    }

    editMovie(movie: MovieListItem): Observable<MovieListItem> {
        return this.httpClient.put<MovieListItem>(`${this.apiUrl}/${movie.MovieID}`, movie);
    }

    deleteMovie(movieId: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.apiUrl}/${movieId}`);
    } 
}