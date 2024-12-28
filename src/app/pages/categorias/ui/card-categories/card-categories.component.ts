import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { ModalCategoryComponent } from '../modal-category/modal-category.component';
import { CategoryService } from '../../services/category.service';
import { ModalCategoryDeleteComponent } from '../modal-category-delete/modal-category-delete.component';

export const Modals = [ModalCategoryComponent, ModalCategoryDeleteComponent];
@Component({
  selector: 'flowbite-categories',
  imports: [ReactiveFormsModule, Modals],
  templateUrl: './card-categories.component.html',
  styleUrl: './card-categories.component.scss',
})
export class CarCategoriesComponent {
  private _categoryService = inject(CategoryService);
  private _storageService = inject(StorageService);
  
  protected readonly seletedUser = signal<number>(this._storageService.getUserId());
  protected readonly form = this._categoryService.formCategory();

  public categoriasResource = rxResource({
    request: () => ({ userId: this.seletedUser() }),
    loader: ({ request }) => this._categoryService.getCategoriesByUserId(request.userId),
  });

  onReload(event: SubmitEvent) {
    this.categoriasResource.reload();
  }

  onReloadDelete(event: SubmitEvent) {
    this.categoriasResource.reload();
  }
}
