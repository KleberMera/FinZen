import { Component, inject, signal } from '@angular/core';
import { Categorias } from '../../models/categorias.models';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Modal } from 'flowbite';

import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';
import { PlusIconComponent } from '@shared/icons/plus-icon/plus-icon.component';
import { DiskIconComponent } from '@shared/icons/disk-icon/disk-icon.component';
import { CloseIconComponent } from '@shared/icons/close-icon/close-icon.component';
import { CategoriasService } from '@services/categorias.service';



@Component({
  selector: 'flowbite-categories',
  imports: [
    PlusIconComponent,
    CloseIconComponent,
    ReactiveFormsModule,
    DiskIconComponent,
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

  private _categService = inject(CategoriasService);
  // private toast = inject(ToastService);

  categoriasResource = rxResource({
    request: () => ({ userId: this.seletedUser() }),
    loader: ({ request }) => this._categService.getCategorias(request.userId),
  });

  openModal() {
    const modalElement = document.getElementById('nueva-categoria-modal');
    const modal = new Modal(modalElement);
    modal.show();
  }

  closeModal() {
    const modalElement = document.getElementById('nueva-categoria-modal');
    const modal = new Modal(modalElement);
    modal.hide();
  }

  async saveCategory() {
    try {
      const payload = this.form().value;
      console.log(payload);

      const res = await firstValueFrom(this._categService.createCategoria(payload));
      if (res.nombre) {
        toast.success('Exito', { description: `Categoria ${payload.nombre} creada`,});
        this.form().reset();
        this.form().patchValue({ tipo: 'Ingreso', usuario_id: this.seletedUser()});
        this.categoriasResource.reload();
        this.closeModal();
      }
    } catch (error: any) {
      toast.error(`Error al crear la categoria`, {description: error.error.message});
    }
  }
}
