import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MovieSchedule } from "./schedule.type";

@Injectable()
export class ScheduleService {
    constructor(private httpClient: HttpClient){ }

    getMoviesList(): Observable<MovieSchedule[]> {
        return this.httpClient.get<MovieSchedule[]>(
            'http://localhost:5001/movies'
        );
    }
}