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

  constructor(private swPush: SwPush) {
  }

  ngOnInit(): void {
    this.onEventNotifications();
  }

  enableNotify() {
    if (this.swPush.isEnabled) {
      try {
        if (Notification.permission != 'granted') {
          this.requestSubscription();
        } else {
          const isConfirm = confirm("Ya tiene los permisos para notificar. ¿Deseas refrescar el token?");
          if (isConfirm) this.requestSubscription();
        }
      } catch (error: any) {
        alert('No se estableció los permisos para notificar');
        console.error(error.message);
      }
    } else {
      console.error("El service worker no ha sido cargado");
    }
  }

  unsubscribe() {
    if (this.swPush.isEnabled && Notification.permission == 'granted')
      this.swPush.unsubscribe();
  }

  getToken() {
    if (this.swPush.isEnabled && Notification.permission == 'granted')
      this.swPush.subscription.subscribe((subscription) => {
        console.log(subscription);
      });
  }

  private async requestSubscription() {
    const payload = await this.swPush.requestSubscription({ serverPublicKey: environment.vapidKey });
    console.log(payload.toJSON());
    this.onEventNotifications();
    //? Hacer petición para guardar token en el backend
  }

  private onEventNotifications() {
    if (this.swPush.isEnabled && Notification.permission == 'granted') {

      this.swPush.notificationClicks.subscribe((data) => {

        console.log(data);
      })

      this.swPush.messages.subscribe((message: any) => {
        console.log(message);
        // console.log(message.notification.data.message);
      });
    }
  }
}
