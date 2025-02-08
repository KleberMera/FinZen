import { Component } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from '@environments/environment.development';
import { Modal } from 'flowbite';
import type { ModalOptions, ModalInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
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
    const payload = await this.swPush.requestSubscription({ serverPublicKey: 'BAuc-ujSh7gHMDIyT4jaCtx-Z-db1gITpVLCfDCCz3f7haRs8rxUoDdS9vzpjApkr8Uey4bKv4XJ0Z0JAlXPLFE' });
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
