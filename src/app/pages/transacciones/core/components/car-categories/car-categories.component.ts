import { Component, inject, resource, signal } from '@angular/core';
import { Categorias } from '../../models/categorias.models';
import { TransaccionesService } from '../../services/transacciones.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-car-categories',
  imports: [],
  templateUrl: './car-categories.component.html',
  styleUrl: './car-categories.component.scss',
})
export class CarCategoriesComponent {
  categorias = signal<Categorias[]>([]);
  seletedUser = signal(2);

  private tranService = inject(TransaccionesService);

  categoriasResource = resource({
    request: () => ( { userId : this.seletedUser()} ),

    loader: async ({ request }) => {
      const userId = request.userId;
      const res = firstValueFrom(this.tranService.getCategorias(userId));
      return res;
    },
  });
}
