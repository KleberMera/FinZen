import { Component, inject, resource, signal } from '@angular/core';
import { Categorias } from '../../models/categorias.models';
import { TransaccionesService } from '../../services/transacciones.service';
import { firstValueFrom } from 'rxjs';

import { ToastService } from '../../../../../components/toast/toast.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PlusIconComponent } from '../../../../../components/Icons/plus-icon/plus-icon.component';
import { CloseIconComponent } from '../../../../../components/Icons/close-icon/close-icon.component';
import { DiskIconComponent } from '../../../../../components/Icons/disk-icon/disk-icon.component';
import { CardUserComponent } from "../card-user/card-user.component";

@Component({
  selector: 'flowbite-categories',
  imports: [
    PlusIconComponent,
    CloseIconComponent,
    ReactiveFormsModule,
    DiskIconComponent,
    CardUserComponent
],
  templateUrl: './card-categories.component.html',
  styleUrl: './card-categories.component.scss',
})
export class CarCategoriesComponent {
  categorias = signal<Categorias[]>([]);
  seletedUser = signal<number>(2);
  form = signal<FormGroup>(
    new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      tipo: new FormControl('Ingreso', [Validators.required]),
      usuario_id: new FormControl(this.seletedUser(), [Validators.required]),
    })
  );

  private tranService = inject(TransaccionesService);
  private toast = inject(ToastService);

  categoriasResource = resource({
    request: () => ({ userId: this.seletedUser() }),
    loader: async ({ request }) => {
      const userId = request.userId;
      const res = await firstValueFrom(this.tranService.getCategorias(userId));
      return res;
    },
  });
  

  async saveCategory() {
    try {
      const payload = this.form().value;
      console.log(payload);
      
      const res = await firstValueFrom(this.tranService.createCategoria(payload));
       if (res.nombre) {
        this.toast.show(
          { message: `Categoria ${payload.nombre} creada exitosamente`, type: 'success'}, { position: 'top-right', duration: 3000 }
        );
        this.form().reset();
        this.form().patchValue({tipo:'Ingreso',usuario_id: this.seletedUser()});
        //Cargar nuevas categorias
        this.categoriasResource.reload();
       }
    } catch (error) {
      this.toast.show({
        message: `Error al crear la categoria`,
        type: 'warning',
      }, { position: 'top-right', });
    }
  }
}
