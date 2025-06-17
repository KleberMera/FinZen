import { Component, input, output } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-sheet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-sheet.component.html',
  styleUrl: './side-sheet.component.scss',
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: '{{initialTransform}}', opacity: 0 }),
        animate('200ms ease-out', style({ transform: '{{finalTransform}}', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: '{{initialTransform}}', opacity: 0 }))
      ])
    ])
  ],
})
export class SideSheetComponent {
  readonly isOpen = input(false);
  readonly position = input<'left' | 'right'>('right'); // Por defecto se abre desde la derecha
  readonly closeSheet = output<void>();

  close() {
    this.closeSheet.emit();
  }

  // Determina las transformaciones iniciales y finales según la posición
  getAnimationParams() {
    if (this.position() === 'right') {
      return {
        value: 'right', // Puedes usar 'right' como un valor de estado si lo necesitaras para animaciones más complejas, pero aquí es un marcador.
        params: { // ¡Esta es la clave! Los parámetros van dentro de 'params'.
          initialTransform: 'translateX(100%)',
          finalTransform: 'translateX(0)'
        }
      };
    } else {
      return {
        value: 'left', // Similar al anterior
        params: {
          initialTransform: 'translateX(-100%)',
          finalTransform: 'translateX(0)'
        }
      };
    }
  }
}