import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Modal } from 'flowbite';
import { rxResource } from '@angular/core/rxjs-interop';
import { Category } from '@models/category';
import { StorageService } from '@services/storage.service';
import { CategoriasService } from '../../services/categorias.service';
import { ModalCategoryComponent } from '../modal-category/modal-category.component';

@Component({
  selector: 'flowbite-categories',
  imports: [ReactiveFormsModule, ModalCategoryComponent],
  templateUrl: './card-categories.component.html',
  styleUrl: './card-categories.component.scss',
})
export class CarCategoriesComponent {
  private _categService = inject(CategoriasService);
  private _storageService = inject(StorageService);
  protected categorias = signal<Category[]>([]);
  protected readonly seletedUser = signal<number>(this._storageService.getUserId());
  protected form = this._categService.formCategory();

  public categoriasResource = rxResource({
    request: () => ({ userId: this.seletedUser() }),
    loader: ({ request }) =>this._categService.getCategoriesByUserId(request.userId)
  });

  openModal() {
    const modalElement = document.getElementById('nueva-categoria-modal');
    const modal = new Modal(modalElement);
    modal.show();
  }

  onReload(event: SubmitEvent) {
    this.categoriasResource.reload();
  }
}
