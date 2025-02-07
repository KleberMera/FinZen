import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  constructor(
    private http: HttpClient,
    private auth: Auth
  ) {}

  async requestPermission() {
    const messaging = getMessaging();
    
    try {
      const currentToken = await getToken(messaging, { 
        vapidKey: environment.vapidKey 
      });

      if (currentToken) {
        await this.saveToken(currentToken);
        return true;
      }
      return false;
    } catch (err) {
      console.log('Error al obtener token:', err);
      return false;
    }
  }

  async initNotifications() {
    const messaging = getMessaging();
    onMessage(messaging, (payload: any) => {
      console.log('Mensaje recibido:', payload);
      if (Notification.permission === 'granted') {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: '/assets/icons/icon-72x72.png'
        });
      }
    });
  }

  private async saveToken(token: string) : Promise<any> {
    const user = await this.auth.currentUser;
    if (user) {
      return this.http.post(`${environment.apiUrl}/notifications/token`, { token }).toPromise();
    }
  }

  updatePreferences(preferences: {
    pushEnabled: boolean;
    daysBeforeNotify: number;
  }) {
    return this.http.post(`${environment.apiUrl}/notifications/preferences`, preferences);
  }
}
