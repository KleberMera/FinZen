import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-strategy',
  imports: [],
  templateUrl: './strategy.component.html',
  styleUrl: './strategy.component.scss'
})
export default class StrategyComponent {
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
    const strategy = this.selectedStrategy();
    if (!strategy) {
      return;
    }
    
    console.log(`Iniciando estrategia: ${strategy}`);
    
    // Aquí puedes navegar a la siguiente página con la estrategia seleccionada
    // this.router.navigateByUrl(`/debt-list/${strategy}`);
    
    // Alternativa usando queryParams
    this.router.navigate(['home/deudas-strategy'], { 
      queryParams: { strategy } 
    });
  }

  // Método para obtener el nombre formateado de la estrategia (opcional)
  getStrategyName(strategy: string): string {
    return strategy === 'bola-de-nieve' ? 'Método Bola de Nieve' : 'Método Avalancha';
  }
}