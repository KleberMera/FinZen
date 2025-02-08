import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { SwPush } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  readonly VAPID_PUBLIC_KEY = 'BB9RG9no5eZuqpw0mqNNTRdo1gzSQJAhVKsI2X8SDuUHnHAKcO8co6UWPkZwykP7OINeSSV3IiN_hjVj_kwhaLM';

  constructor(
    private swPush: SwPush,
    private http: HttpClient
  ) {}

  async requestSubscription() {
    try {
      // Obtener usuario del localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('Usuario no encontrado');
      }
      
      const user = JSON.parse(userStr);
      
      // Solicitar suscripción
      const sub = await this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      });
      
      // Enviamos la suscripción al backend junto con el userId
      await this.http.post(
        `${environment.apiUrl}/notifications/subscribe`, 
        {
          userId: user.id,
          subscription: sub
        }
      ).toPromise();
      
      return true;
    } catch (err) {
      console.error('Could not subscribe to notifications', err);
      return false;
    }
  }
}
