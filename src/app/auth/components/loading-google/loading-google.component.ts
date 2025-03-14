import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-google',
  imports: [],
  templateUrl: './loading-google.component.html',
  styleUrl: './loading-google.component.scss'
})
export class LoadingGoogleComponent {
  isVisible = true;

  // Maneja el clic en el contenedor de fondo
  onBackdropClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Verifica si el clic fue en el fondo (contenedor principal)
    if (target.classList.contains('bg-gray-900/50') || target.classList.contains('dark:bg-black/60')) {
      this.closeModal();
    }
  }

  // Cierra el modal
  closeModal() {
    this.isVisible = false;
    // Aquí podrías emitir un evento o llamar a un servicio si necesitas notificar a otros componentes
  }
}
