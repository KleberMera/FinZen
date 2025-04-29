import { Component, inject, input, signal } from '@angular/core';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-strategy-method',
  imports: [],
  templateUrl: './strategy-method.component.html',
  styleUrl: './strategy-method.component.scss'
})
export default class StrategyMethodComponent {
 // Inyectar ActivatedRoute para acceder a los query parameters
  metodo = input<string>('');
  readonly router = inject(Router);

  goToStrategy(): void {
    this.router.navigate(['home/deudas-estrategia/elegir']);
  }
}
