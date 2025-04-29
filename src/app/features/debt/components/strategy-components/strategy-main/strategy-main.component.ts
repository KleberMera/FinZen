import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DEBT_PAGES } from '../../../debt.routes';

@Component({
  selector: 'app-strategy-main',
  imports: [],
  templateUrl: './strategy-main.component.html',
  styleUrl: './strategy-main.component.scss',
})
export class StrategyMainComponent {
  // Signal para la estrategia seleccionada
  selectedStrategy = signal<string | null>(null);

  // Inyectar el router usando el nuevo método de inyección funcional
  private router = inject(Router);

  // Método para seleccionar una estrategia
  selectStrategy(strategy: string): void {
    // Si la estrategia ya está seleccionada, la deseleccionamos
    if (this.selectedStrategy() === strategy) {
      this.selectedStrategy.set(null);
    } else {
      // Si no, la seleccionamos
      this.selectedStrategy.set(strategy);
    }

    console.log(`Estrategia seleccionada: ${this.selectedStrategy()}`);
  }

  // Método para iniciar la estrategia seleccionada
  startStrategy(): void {
    const metodo = this.selectedStrategy();
    if (!metodo) {
      return;
    }

    console.log(`Iniciando estrategia: ${metodo}`);

    // Navegar usando query parameters en lugar de parámetros de ruta
    this.router.navigate([`home/${DEBT_PAGES.DEBT_SELECTED_STRATEGY}`], {
      queryParams: { metodo },
    });
  }

  // Método para obtener el nombre formateado de la estrategia (opcional)
  getStrategyName(strategy: string): string {
    return strategy === 'bola-de-nieve'
      ? 'Método Bola de Nieve'
      : 'Método Avalancha';
  }
}
