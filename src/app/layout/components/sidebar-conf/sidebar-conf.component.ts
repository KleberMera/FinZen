
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-conf',
  imports: [],
  templateUrl: './sidebar-conf.component.html',
  styleUrl: './sidebar-conf.component.scss'
})
export class SidebarConfComponent {
  isDarkMode = false;

  constructor() {
    // Verificar si ya existe una preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  openSettings() {
    // Implementar la lógica para abrir el modal o página de configuración
    console.log('Abriendo configuración...');
    // Ejemplo: this.dialog.open(SettingsComponent);
  }
}
