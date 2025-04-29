import { NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-tab-password',
  imports: [NgIf],
  templateUrl: './tab-password.component.html',
  styleUrl: './tab-password.component.scss'
})
export default class TabPasswordComponent {
  // Control de visibilidad de contraseña
  showPassword = signal(false);


  // Método para mostrar/ocultar contraseña
  togglePasswordVisibility(): void {
    this.showPassword.update((value: any) => !value);
  }
}
