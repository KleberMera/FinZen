import { Component, inject, resource, signal } from '@angular/core';
import { Categorias } from '../../models/categorias.models';
import { TransaccionesService } from '../../services/transacciones.service';
import { firstValueFrom } from 'rxjs';

import { ToastService } from '../../../../../components/services/toast.service';

@Component({
  selector: 'flowbite-categories',
  imports: [],
  templateUrl: './card-categories.component.html',
  styleUrl: './card-categories.component.scss',
})
export class CarCategoriesComponent {
  categorias = signal<Categorias[]>([]);
  seletedUser = signal(2);

  private tranService = inject(TransaccionesService);
  constructor(private toastService: ToastService) {}
  categoriasResource = resource({
    request: () => ({ userId: this.seletedUser() }),

    loader: async ({ request }) => {
      const userId = request.userId;
      const res = firstValueFrom(this.tranService.getCategorias(userId));
      return res;
    },
  });

  saveCategory() {
    // Tu lógica de guardado
    const success = true; // Reemplaza con tu lógica real

    if (success) {
     this.toastService.show({
       type: 'success',
       message: 'Categoría guardada .',
     },
    {
      duration: 2000,
      position: 'top-right'
    })
    } else {
      this.toastService.show({
        type: 'danger',
        message: 'Error al guardar la categoría.',
      });
    }
  }
}
