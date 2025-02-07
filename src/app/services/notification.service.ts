import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { deleteToken, getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { environment } from '@environments/environment.development';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private messaging: Messaging, private http: HttpClient) {}

  async requestPermission() {
    try {
      const token = await getToken(this.messaging, {
       vapidKey: environment.firebaseConfig.vapidKey
      });
      if (token) {
        await this.http.post('/api/notifications/subscribe', { token }).toPromise();
      }
      return token;
    } catch (error) {
      console.error('Error getting notification token', error);
      return null;
    }
  }

  listenMessages() {
    return onMessage(this.messaging, (payload) => {
      console.log('Message received:', payload);
      new Notification(payload.notification?.title || '', {
        body: payload.notification?.body,
        icon: 'favicon.png'
      });
    });
  }
  
}
