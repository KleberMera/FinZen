import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Device } from '@models/device';
import { DeviceService } from '../../services/device.service';
import { StorageService } from '@services/storage.service';
import { apiResponse } from '@models/apiResponse';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../../shared/layout/navbar/services/notification.service';
import { SwPush } from '@angular/service-worker';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-tab-notification',
  imports: [],
  templateUrl: './tab-notification.component.html',
  styleUrl: './tab-notification.component.scss'
})
export class TabNotificationComponent {
 // Servicios inyectados
 private readonly _deviceService = inject(DeviceService);
 private readonly _storage = inject(StorageService);
 private readonly _notifications = inject(NotificationService);
 private readonly _swPush = inject(SwPush);

 // Signals para el estado reactivo
 userId = signal<number>(this._storage.getUserId());
 currentDevice = signal<Device | null>(null);
 notificationStatus = signal<'enabled' | 'disabled' | 'loading' | 'blocked' | 'granted-no-subscription'>('loading');
 subscriptionCount = signal<number>(0);

 // Computed signals para valores derivados
 currentDeviceId = computed(() => this.currentDevice()?.id ?? null);
 devices = computed(() => this.devicesResource.value()?.data ?? []);
 isDeviceSynced = computed(() => this.currentDeviceId() !== null);

 // Resource para cargar dispositivos de forma reactiva
 devicesResource = rxResource({
   request: () => ({ userId: this.userId() }),
   loader: ({ request }) => this._deviceService.getDevicesByUserId(request.userId),
 });

 constructor() {
   // Effect para actualizar el dispositivo actual y el estado de notificaciones
   effect(() => {
     const devices = this.devices();
     const currentDevice = this.findCurrentDevice(devices);
     this.currentDevice.set(currentDevice!);

     if (currentDevice) {
       this.checkNotificationStatus();
       this.loadSubscriptionCount();
     } else {
       this.notificationStatus.set('disabled');
     }
   });
 }

 // Método para identificar el dispositivo actual
 private findCurrentDevice(devices: Device[]): Device | undefined {
   return devices.find(device => this.isCurrentDevice(device));
 }

 // Método para verificar si un dispositivo es el actual
 isCurrentDevice(device: Device): boolean {
   return (
     device.userAgent === navigator.userAgent &&
     device.os === (navigator.platform || 'Unknown') &&
     device.browser === this.getBrowserInfo() &&
     device.isMobile === /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
     device.brand === (navigator.vendor || 'Unknown') &&
     device.model === (navigator.platform || 'Unknown')
   );
 }

 // Cargar el conteo de suscripciones
 private loadSubscriptionCount() {
   this._notifications.countSubscriptions(this.userId()).subscribe({
     next: (response) => this.subscriptionCount.set(response.subscriptions),
     error: (error) => {
       console.error('Error al contar suscripciones:', error);
       this.subscriptionCount.set(0);
     },
   });
 }

 // Verificar el estado de las notificaciones
 private checkNotificationStatus() {
   this.notificationStatus.set('loading');

   if (!('Notification' in window)) {
     this.notificationStatus.set('disabled');
     return;
   }

   if (Notification.permission === 'denied') {
     this.notificationStatus.set('blocked');
     return;
   }

   this._notifications.hasSubscription(this.userId()).subscribe({
     next: (response) => {
       if (response.hasSubscription) {
         this.notificationStatus.set('enabled');
       } else if (Notification.permission === 'granted') {
         this.notificationStatus.set('granted-no-subscription');
       } else {
         this.notificationStatus.set('disabled');
       }
     },
     error: (error) => {
       console.error('Error al verificar la suscripción:', error);
       this.notificationStatus.set('disabled');
     },
   });
 }

 // Manejar el clic en el botón de notificaciones
 async onNotificationClick() {
   const userId = this.userId();
   const deviceId = this.currentDeviceId();

   if (!deviceId) {
     toast.error('Dispositivo no reconocido. Por favor, sincroniza primero tu dispositivo.');
     return;
   }

   if (this.notificationStatus() === 'enabled') {
     if (confirm('¿Deseas desactivar las notificaciones?')) {
       this.unsubscribe(userId, deviceId);
     }
     return;
   }

   if (this.notificationStatus() === 'blocked') {
     alert('Las notificaciones están bloqueadas en tu navegador. Por favor, cambia la configuración de permisos.');
     return;
   }

   if (Notification.permission === 'default') {
     const permission = await Notification.requestPermission();
     if (permission === 'denied') {
       this.notificationStatus.set('blocked');
       toast.error('Has rechazado los permisos de notificación');
       return;
     }
   }

   this.requestSubscription(userId, deviceId);
 }

 // Solicitar suscripción a notificaciones
 private async requestSubscription(userId: number, deviceId: number) {
   if (this.subscriptionCount() >= 2) {
     toast.error('Ya tienes el máximo de suscripciones permitidas (2)');
     return;
   }

   try {
     const sub = await this._swPush.requestSubscription({
       serverPublicKey: environment.VAPID_PUBLIC_KEY,
     });

     this._notifications.notificationSubscribeWithDevice(userId, deviceId, sub).subscribe({
       next: () => {
         toast.success('Notificaciones activadas correctamente');
         this.notificationStatus.set('enabled');
         this.loadSubscriptionCount();
       },
       error: (error) => {
         console.error('Error al activar las notificaciones:', error);
         toast.error('Error al activar las notificaciones');
         this.notificationStatus.set('disabled');
       },
     });
   } catch (error) {
     console.error('Error al solicitar la suscripción:', error);
     toast.error('No se pudieron activar las notificaciones');
     this.notificationStatus.set('disabled');
   }
 }

 // Desuscribirse de las notificaciones
 private unsubscribe(userId: number, deviceId: number) {
   this._notifications.unsubscribeWithDevice(userId, deviceId).subscribe({
     next: () => {
       toast.success('Notificaciones desactivadas correctamente');
       this.notificationStatus.set('disabled');
       this.loadSubscriptionCount();
     },
     error: (error) => {
       console.error('Error al desactivar las notificaciones:', error);
       toast.error('Error al desactivar las notificaciones');
     },
   });
 }

 // Detectar el navegador actual
 private getBrowserInfo(): string {
   const userAgent = navigator.userAgent.toLowerCase();
   if (/firefox/.test(userAgent)) return 'Firefox';
   if (/edg/.test(userAgent)) return 'Edge';
   if (/chrome/.test(userAgent)) return 'Chrome';
   if (/safari/.test(userAgent)) return 'Safari';
   if (/opera/.test(userAgent)) return 'Opera';
   return 'Unknown';
 }
}
