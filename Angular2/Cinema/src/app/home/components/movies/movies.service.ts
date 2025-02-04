import { Injectable } from "@angular/core";
import { MovieListItem } from "./movies.type";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

//Сервіс для зв'язки з сервером та отримання інфи про фільми
@Injectable()
export class MoviesService {

    constructor(private httpClient: HttpClient){ }

    private apiUrl = 'http://localhost:5001/movies';
    
    //Запит на отримання всіх фільмів з сервера
    getMoviesList(): Observable<MovieListItem[]> {
        return this.httpClient.get<MovieListItem[]>(
            'http://localhost:5001/movies'
        );
    }
    
    //Запит на отримання фільмів за рядком пошуку
    getMovieByName(term: string): Observable<MovieListItem[]> {
        return this.httpClient.get<MovieListItem[]>(
            `${this.apiUrl}/search/${term}`
        );
    }

    //Запит на отримання деталей фільму за ID
    getMovieById(MovieID: string): Observable<MovieListItem> {
        return this.httpClient.get<MovieListItem>(`${this.apiUrl}/${MovieID}`);
    }  
}