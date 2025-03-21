import { NgClass, NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TabProfileComponent } from "../../components/tab-profile/tab-profile.component";
import { TabDeviceComponent } from "../../components/tab-device/tab-device.component";
import { TabNotificationComponent } from "../../components/tab-notification/tab-notification.component";

@Component({
  selector: 'app-config',
  imports: [NgIf, TabProfileComponent, TabDeviceComponent, TabNotificationComponent],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent {
  // Tabs disponibles
  tabs = signal([
    { id: 'perfil', label: 'Perfil', icon: 'pi pi-user' },
    { id: 'sincronizar', label: 'Sincronizar', icon: 'pi pi-sync' },
    { id: 'dispositivos', label: 'Dispositivos', icon: 'pi pi-mobile' },
    { id: 'contrasena', label: 'Contraseña', icon: 'pi pi-lock' },
    { id: 'notificaciones', label: 'Notificaciones', icon: 'pi pi-bell' }
  ]);
  
  // Tab activo
  activeTab = signal('perfil');
  
  // Control de visibilidad de contraseña
  showPassword = signal(false);
  
  // Opciones de sincronización (ejemplo)
  syncOptions = signal([
    { 
      id: 'sync-cloud', 
      label: 'Sincronización en la nube', 
      description: 'Mantén tus datos sincronizados entre dispositivos', 
      enabled: true 
    },
    { 
      id: 'sync-auto', 
      label: 'Sincronización automática', 
      description: 'Sincroniza automáticamente cuando haya cambios', 
      enabled: true 
    },
    { 
      id: 'sync-wifi', 
      label: 'Solo en WiFi', 
      description: 'Sincronizar solo cuando estés conectado a WiFi', 
      enabled: false 
    }
  ]);
  
  
  
  // Método para cambiar de tab
  setActiveTab(tabId: string): void {
    this.activeTab.set(tabId);
  }
  
  // Método para mostrar/ocultar contraseña
  togglePasswordVisibility(): void {
    this.showPassword.update((value: any) => !value);
  }


}
