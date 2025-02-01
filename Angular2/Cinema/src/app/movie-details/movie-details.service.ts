import { Injectable } from "@angular/core";
import { MovieDetails } from "./movie-interface";
// import { movies } from "./movies.data";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class MoviesDetailsService {
    constructor(private httpClient: HttpClient){ }

    getMoviesList(): Observable<MovieDetails[]> {
        return this.httpClient.get<MovieDetails[]>(
            'http://localhost:5001/movies'
        );
    }
}