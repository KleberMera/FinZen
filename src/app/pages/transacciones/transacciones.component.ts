import { Component } from '@angular/core';

import { CardUserComponent } from "./core/components/card-user/card-user.component";
import { CarCategoriesComponent } from './core/components/card-categories/card-categories.component';

@Component({
  selector: 'app-transacciones',
  imports: [CarCategoriesComponent],
  templateUrl: './transacciones.component.html',
  styleUrl: './transacciones.component.scss',
})
export class TransaccionesComponent {
  
}
