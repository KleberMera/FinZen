import { Component } from '@angular/core';
import { CarCategoriesComponent } from './ui/card-categories/card-categories.component';

@Component({
  selector: 'app-categorias',
  imports: [CarCategoriesComponent],
  template: `@defer (on viewport) {<flowbite-categories></flowbite-categories>
    } @placeholder {
    <div></div>
    } `,
})
export class CategoriasComponent {}
