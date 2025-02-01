import { Injectable } from "@angular/core";
import { MovieListItem } from "./movies.type";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class MoviesService {
    constructor(private httpClient: HttpClient){ }

    getMoviesList(): Observable<MovieListItem[]> {
        return this.httpClient.get<MovieListItem[]>(
            'http://localhost:5001/movies'
        );
    }
    
}