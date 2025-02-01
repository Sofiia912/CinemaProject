import { Component } from '@angular/core';
import {  RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './home/components/header/header.component';
import { FooterComponent } from './home/components/footer/footer.component';
// import { MovieDetailsComponent } from "./movie-details/movie-details.component";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, HeaderComponent, FooterComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Cinema';
}
