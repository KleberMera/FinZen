import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, output, Output, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile-sidebar',
  imports: [CommonModule, ReactiveFormsModule, NgIf],
  templateUrl: './user-profile-sidebar.component.html',
  styleUrl: './user-profile-sidebar.component.scss'
})
export class UserProfileSidebarComponent {
  closeSidebar = output<void>();
  editMode = signal(false);
  
  userData = signal({
    id: 1,
    name: 'John',
    last_name: 'Doe',
    username: 'johndoe',
    email: 'john@example.com',
    phone: '+1234567890',
    role: 'Administrador',
    avatar: 'https://randomuser.me/api/portraits/men/91.jpg',
    status: true,
    createdAt: new Date(),
    // ... otros campos del modelo
  });

  // Controles del formulario
  nameControl = new FormControl(this.userData().name);
  usernameControl = new FormControl(this.userData().username);
  emailControl = new FormControl(this.userData().email);
  phoneControl = new FormControl(this.userData().phone);

  enableEdit() {
    this.editMode.set(true);
  }

  cancelEdit() {
    this.editMode.set(false);
    // Restablecer valores
    this.nameControl.setValue(this.userData().name);
    this.usernameControl.setValue(this.userData().username);
    this.emailControl.setValue(this.userData().email);
    this.phoneControl.setValue(this.userData().phone);
  }

  saveChanges() {
    this.userData.update(data => ({
      ...data,
      name: this.nameControl.value || '',
      username: this.usernameControl.value || '',
      email: this.emailControl.value || '',
      phone: this.phoneControl.value || ''
    }));
    this.editMode.set(false);
  }

  close() {
    this.closeSidebar.emit();
  }
}
