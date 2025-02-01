import { Component } from '@angular/core';
import { ScheduleService } from './schedule.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MovieSchedule } from './schedule.type';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
  providers: [ScheduleService]
  
})
export class ScheduleComponent {
  movies: MovieSchedule[] = [];

  constructor(ScheduleService: ScheduleService) {
    ScheduleService.getMoviesList().subscribe((movies) => {
      this.movies = movies;
    })
  }
}
