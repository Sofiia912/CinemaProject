import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './home/components/not-found/not-found.component';
import { ContactsComponent } from './home/components/contacts/contacts.component';
import { MoviesComponent } from './home/components/movies/movies.component';
import { MovieDetailsComponent } from './home/components/movie-details/movie-details.component';

import { SettingsComponent } from './home/components/settings/settings.component';
import { ScheduleComponent } from './home/components/schedule/schedule.component';
import { SeatPickerComponent } from './home/components/seat-picker/seat-picker.component';

import { ProfileComponent } from './home/components/profile/profile.component';
import { LoginComponent } from './home/components/login/login.component';
import { RegisterComponent } from './home/components/register/register.component';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
  { path: '',     redirectTo: '/home',   pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  { path: 'sessions', component: ScheduleComponent },

  { path: 'movies',      component: MoviesComponent },
  { path: 'movie/:MovieID', component: MovieDetailsComponent },

  { path: 'booking/:sessionId',
    component: SeatPickerComponent,
    canActivate: [AuthGuard]
  },

  { path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },

  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'contacts',  component: ContactsComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**',        redirectTo: 'not-found' }
];