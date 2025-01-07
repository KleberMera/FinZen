import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/ngsw-worker.js')
      .then((reg) => {
        console.log('Service Worker Registered', reg);
      })
      .catch((err) => {
        console.log('Service Worker Registration Failed', err);
      });
  });
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
