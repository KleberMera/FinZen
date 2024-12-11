import { Component, inject, resource, signal } from '@angular/core';
import { Categorias } from '../../models/categorias.models';
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
import { Modal } from 'flowbite';
import { CategoriasService } from '../../../../../services/categorias.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';

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
  private toast = inject(ToastService);

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

      const res = await firstValueFrom(
        this._categService.createCategoria(payload)
      );
      if (res.nombre) {
        this.toast.show(
          {
            message: `Categoria ${payload.nombre} creada exitosamente`,
            type: 'success',
          },
          { position: 'top-right', duration: 3000 }
        );
        this.form().reset();
        this.form().patchValue({
          tipo: 'Ingreso',
          usuario_id: this.seletedUser(),
        });
        //Cargar nuevas categorias
        this.categoriasResource.reload();
        this.closeModal();
      }
    } catch (error) {
      this.toast.show(
        {
          message: `Error al crear la categoria`,
          type: 'warning',
        },
        { position: 'top-right' }
      );
    }
  }
}
