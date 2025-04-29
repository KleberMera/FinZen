
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CONFIG_PAGES_CONFIGURATION } from '../../config.routes';

@Component({
  selector: 'app-config',
  imports: [

    RouterOutlet,
    RouterLink,
    RouterLinkActive
],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
})
export class ConfigComponent {
  public readonly router = inject(Router);
  readonly url = CONFIG_PAGES_CONFIGURATION

  // Tabs disponibles
  tabs = signal([
    { id: 'perfil', label: 'Perfil', icon: 'pi pi-user', route: this.url.PERFIL },
    { id: 'sincronizar', label: 'Google', icon: 'pi pi-google', route: this.url.SINCRONIZAR_GOOGLE },
    { id: 'dispositivos', label: 'Dispositivos', icon: 'pi pi-mobile', route: this.url.DISPOSITIVOS },
    { id: 'contrasena', label: 'Contraseña', icon: 'pi pi-lock', route: this.url.CONTRASENA },
    { id: 'notificaciones', label: 'Notificaciones', icon: 'pi pi-bell', route: this.url.NOTIFICACIONES }
  ]);

}
