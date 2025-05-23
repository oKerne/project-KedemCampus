import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http'; 
// import { provideEffects } from '@ngrx/effects';
// import { AuthEffects } from './store/auth/auth.effects';
// import { authReducer } from './store/auth/auth.reducer';
// import { provideStore } from '@ngrx/store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    // provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch())
    // provideStore({ auth: authReducer }),
    // provideEffects([AuthEffects])
  ]
};
