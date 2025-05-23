import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import app from './server';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  // ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideRouter(routes),
    provideHttpClient(withFetch())
  ]
});

// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { importProvidersFrom } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
// import { provideHttpClient, withFetch } from '@angular/common/http';
// import { provideRouter, Routes } from '@angular/router';
// // import { provideStore } from '@ngrx/store';
// // import { provideEffects } from '@ngrx/effects';
// // import { AuthEffects } from './app/store/auth/auth.effects';
// // import { provideState } from '@ngrx/store';
// // import { authReducer } from './app/store/auth/auth.reducer'; 
// import { AuthService } from './app/services/auth.service';
// import { CommonModule } from '@angular/common';

// const routes: Routes = [
// ];

// bootstrapApplication(AppComponent, {
//   providers: [ 
//     importProvidersFrom(CommonModule),
//     provideHttpClient(withFetch()),
//     provideRouter(routes),
   
    
//     // AuthService, 
//     // provideStore(),
//     // provideEffects([AuthEffects]),
//     // provideState('auth', authReducer), 
//   ],
// }).catch((err) => console.error(err));
