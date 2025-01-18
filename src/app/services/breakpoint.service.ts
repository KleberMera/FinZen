import { computed, effect, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {

  private readonly screenWidth = signal<number>(window.innerWidth);
  readonly isMobile = computed(() => this.screenWidth() < 768);

  constructor() {
    // Usar el addEventListener moderno con options
    window.addEventListener('resize', () => {
      this.screenWidth.set(window.innerWidth);
    }, { passive: true });

    // Opcional: Efecto para debugging
    effect(() => {
      console.debug('[ScreenService] isMobile:', this.isMobile());
    }, { allowSignalWrites: true });
  }
}
