import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter }  from '@angular/router';
import { routes }         from './app.routes';

import { provideHttpClient, withInterceptors} from '@angular/common/http';
import localeUk                                from '@angular/common/locales/uk';
import { LOCALE_ID }                           from '@angular/core';
import { registerLocaleData }                  from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { provideClientHydration }              from '@angular/platform-browser';

import { authInterceptorFn } from './services/auth.interceptor';

registerLocaleData(localeUk);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideHttpClient(
       withInterceptors([authInterceptorFn])
    ),

    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule
    ),

    provideClientHydration(),

    { provide: LOCALE_ID, useValue: 'uk' },
  ]
};
