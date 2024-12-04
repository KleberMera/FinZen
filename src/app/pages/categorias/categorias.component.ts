import { Component } from '@angular/core';
import { CarCategoriesComponent } from "./core/components/card-categories/card-categories.component";
import { CardUserComponent } from "./core/components/card-user/card-user.component";

@Component({
  selector: 'app-categorias',
  imports: [CarCategoriesComponent, CardUserComponent],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent {

}
