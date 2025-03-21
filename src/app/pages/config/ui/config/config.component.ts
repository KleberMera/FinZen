import { NgClass, NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TabProfileComponent } from "../../components/tab-profile/tab-profile.component";
import { TabDeviceComponent } from "../../components/tab-device/tab-device.component";
import { TabNotificationComponent } from "../../components/tab-notification/tab-notification.component";
import { TabGoogleComponent } from "../../components/tab-google/tab-google.component";

@Component({
  selector: 'app-config',
  imports: [NgIf, TabProfileComponent, TabDeviceComponent, TabNotificationComponent, TabGoogleComponent],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent {
  // Tabs disponibles
  tabs = signal([
    { id: 'perfil', label: 'Perfil', icon: 'pi pi-user' },
    { id: 'sincronizar', label: 'Google', icon: 'pi pi-google' },
    { id: 'dispositivos', label: 'Dispositivos', icon: 'pi pi-mobile' },
    { id: 'contrasena', label: 'Contraseña', icon: 'pi pi-lock' },
    { id: 'notificaciones', label: 'Notificaciones', icon: 'pi pi-bell' }
  ]);
  
  // Tab activo
  activeTab = signal('perfil');
  
  // Control de visibilidad de contraseña
  showPassword = signal(false);
  

  
  
  
  // Método para cambiar de tab
  setActiveTab(tabId: string): void {
    this.activeTab.set(tabId);
  }
  
  // Método para mostrar/ocultar contraseña
  togglePasswordVisibility(): void {
    this.showPassword.update((value: any) => !value);
  }


}
