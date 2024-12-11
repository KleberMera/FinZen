import { Component } from '@angular/core';
import { CarCategoriesComponent } from './core/components/card-categories/card-categories.component';
import { CardUserComponent } from './core/components/card-user/card-user.component';

@Component({
  selector: 'app-categorias',
  imports: [CarCategoriesComponent, CardUserComponent],
  template: `@defer (on viewport; prefetch on idle) {
    <flowbite-user></flowbite-user>
    } @placeholder {
    <div>Large component placeholder</div>
    } @defer (on viewport) {<flowbite-categories></flowbite-categories>
    } @placeholder {
    <div>Large component placeholder</div>
    } `,
})
export class CategoriasComponent {}
