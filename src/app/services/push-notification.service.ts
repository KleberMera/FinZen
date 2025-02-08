import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from '@environments/environment';
import { SwPush } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  readonly VAPID_PUBLIC_KEY = 'BAuc-ujSh7gHMDIyT4jaCtx-Z-db1gITpVLCfDCCz3f7haRs8rxUoDdS9vzpjApkr8Uey4bKv4XJ0Z0JAlXPLFE';

  constructor(
    private swPush: SwPush,
    private http: HttpClient
  ) {}

  async requestSubscription() {
    try {
      const sub = await this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      });
      
      // Enviamos la suscripción al backend
      await this.http.post(
        `${environment.apiUrl}/notifications/subscribe`, 
        sub
      ).toPromise();
      
      return true;
    } catch (err) {
      console.error('Could not subscribe to notifications', err);
      return false;
    }
  }
}
