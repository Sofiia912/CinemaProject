import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { MoviesComponent } from './home/components/movies/movies.component';

export const routes: Routes = [
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'home', component: HomeComponent },
        { path: 'schedule', component: ScheduleComponent },
        { path: 'movies', component: MoviesComponent },
        { path: 'contacts', component: ContactsComponent },
        { path: '**',redirectTo: 'home'}
];