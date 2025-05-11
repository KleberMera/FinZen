import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../shared/layout/navbar/navbar.component';
import { SidebarComponent } from '../shared/layout/sidebar/sidebar.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [NavbarComponent, RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  sidebarOpen = signal(false);
  sidebarCollapsed = signal(false);
  private router = inject(Router);

  constructor() {
    // Suscribirse a eventos del router para cerrar el sidebar en navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (window.innerWidth < 768) { // Solo en mobile
        this.closeSidebar();
      }
    });

    // Escuchar eventos de redimensionamiento de ventana
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        this.sidebarOpen.set(true);
      } else {
        this.sidebarOpen.set(false);
      }
    });

    // Establecer estado inicial del sidebar según el tamaño de la ventana
    if (window.innerWidth >= 768) {
      this.sidebarOpen.set(true);
    }
  }

  toggleSidebar() {
    this.sidebarOpen.update(current => !current);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }
}
