import { ApplicationConfig, provideZoneChangeDetection, isDevMode} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { handleErrorInterceptor } from './core/interceptors/handle-error.interceptor';
import { provideServiceWorker } from '@angular/service-worker';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '@environments/environment.development';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
export const appConfig: ApplicationConfig = {
  providers: [
    provideAuth(() => getAuth()),
    provideMessaging(() => getMessaging()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(), withInterceptors([handleErrorInterceptor])),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),

    provideFirebaseApp(() =>
      initializeApp(environment.firebaseConfig)
    ),

  ],
};
