import { Component, EventEmitter, output, Output, signal } from '@angular/core';

@Component({
  selector: 'app-user-profile-sidebar',
  imports: [],
  templateUrl: './user-profile-sidebar.component.html',
  styleUrl: './user-profile-sidebar.component.scss'
})
export class UserProfileSidebarComponent {
  closeSidebar = output<void>();
  
  // Datos random (puedes reemplazar con datos reales luego)
  userData = signal({

      name: 'John Doe',
      email: 'john@example.com',
      role: 'Administrador',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      lastLogin: 'Hace 2 horas'
  
  })

  close() {
    this.closeSidebar.emit();
  }
}
