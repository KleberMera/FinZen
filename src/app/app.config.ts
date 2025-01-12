import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { handleErrorInterceptor } from './core/interceptors/handle-error.interceptor';
import { provideServiceWorker } from '@angular/service-worker';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
//import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
export const appConfig: ApplicationConfig = {
  providers: [
    //provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(), withInterceptors([handleErrorInterceptor])),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),

    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyCzisdNiu6Q2L6vvs5mFvcSWelZVZWOuaU',
        authDomain: 'finzen-7e19c.firebaseapp.com',
        projectId: 'finzen-7e19c',
        storageBucket: 'finzen-7e19c.firebasestorage.app',
        messagingSenderId: '119155339545',
        appId: '1:119155339545:web:de2efa367f9ac3c15dd588',
        measurementId: 'G-BZNEC94VVF',
      })
    ),
  ],
};
