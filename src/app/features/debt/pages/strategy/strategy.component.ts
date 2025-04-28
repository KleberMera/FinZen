import { Component } from '@angular/core';

@Component({
  selector: 'app-strategy',
  imports: [],
  templateUrl: './strategy.component.html',
  styleUrl: './strategy.component.scss'
})
export default class StrategyComponent {


  startStrategy() {
    // Aquí podrías navegar a un formulario de selección de deudas
    console.log('Iniciar estrategia');
    // ejemplo: this.router.navigate(['/seleccionar-deudas']);
  }

}
