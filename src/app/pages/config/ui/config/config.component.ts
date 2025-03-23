import {   } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TabProfileComponent } from '../../components/tab-profile/tab-profile.component';
import { TabDeviceComponent } from '../../components/tab-device/tab-device.component';
import { TabNotificationComponent } from '../../components/tab-notification/tab-notification.component';
import { TabGoogleComponent } from '../../components/tab-google/tab-google.component';
import { TabPasswordComponent } from "../../components/tab-password/tab-password.component";
import { TabService } from '../../services/tab.service';

@Component({
  selector: 'app-config',
  imports: [
    TabProfileComponent,
    TabDeviceComponent,
    TabNotificationComponent,
    TabGoogleComponent,
    TabPasswordComponent
],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
})
export class ConfigComponent {
  private readonly _tabService = inject(TabService);
  // Tabs disponibles
  tabs = signal([
    { id: 'perfil', label: 'Perfil', icon: 'pi pi-user' },
    { id: 'sincronizar', label: 'Google', icon: 'pi pi-google' },
    { id: 'dispositivos', label: 'Dispositivos', icon: 'pi pi-mobile' },
    { id: 'contrasena', label: 'Contraseña', icon: 'pi pi-lock' },
    { id: 'notificaciones', label: 'Notificaciones', icon: 'pi pi-bell' },
  ]);
  activeTab = this._tabService.activeTab; // Usamos el signal del servicio

  setActiveTab(tabId: string): void {
    this._tabService.setActiveTab(tabId); // Delegamos al servicio
  }

}
