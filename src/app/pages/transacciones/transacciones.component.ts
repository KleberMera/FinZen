import { Component } from '@angular/core';
import { CarCategoriesComponent } from "./core/components/car-categories/car-categories.component";
import { CardUserComponent } from "./core/components/card-user/card-user.component";

@Component({
  selector: 'app-transacciones',
  imports: [CarCategoriesComponent, CardUserComponent],
  templateUrl: './transacciones.component.html',
  styleUrl: './transacciones.component.scss',
})
export class TransaccionesComponent {
  
}
