import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ContactsComponent } from './contacts/contacts.component';
import { MoviesComponent } from './home/components/movies/movies.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { SessionsComponent } from './sessions/sessions.component';


export const routes: Routes = [
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'home', component: HomeComponent },
        { path: 'schedule', component: SessionsComponent },
        { path: 'movies', component: MoviesComponent },
        { path: 'contacts', component: ContactsComponent },
        { path: 'movie/:MovieID', component: MovieDetailsComponent},     
        { path: 'not-found', component: NotFoundComponent },
        { path: '**', redirectTo: 'not-found'}
];