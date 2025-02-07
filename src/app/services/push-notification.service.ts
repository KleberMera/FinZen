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
    try {
      const messaging = getMessaging();
    //  const envToken = environment.vapidKey;
      // Primero verifica el permiso
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }
  
      // Luego intenta obtener el token
      const currentToken = await getToken(messaging, { 
        vapidKey: 'BJX1_SSFAbJFKCE1jqE-BQdfy7pLNm0RPURsxoxtvUP5p88ORWbY7lgZSmL0JLcTR9AWWeDVNaqQXIdNBE-AfPA'
      });
  
      if (currentToken) {
        await this.saveToken(currentToken);
        return true;
      }
      
      throw new Error('No registration token available');
    } catch (err) {
      console.error('Error al obtener token:', err);
      return false;
    }
  }

  async initNotifications() {
    const messaging = getMessaging();
    console.log('Inicializando notificaciones...');
    
    onMessage(messaging, (payload: any) => {
      console.log('Mensaje recibido:', payload);
      if (Notification.permission === 'granted') {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: 'favicon.png',
        });
      }
    });
  }

  private async saveToken(token: string) : Promise<any> {
    const user = this.auth.currentUser;
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
