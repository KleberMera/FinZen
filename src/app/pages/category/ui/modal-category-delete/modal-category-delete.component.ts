import { Component, inject, output, signal } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'ModalcategoryDelete',
  imports: [],
  templateUrl: './modal-category-delete.component.html',
  styleUrl: './modal-category-delete.component.scss',
})
export class ModalCategoryDeleteComponent {
  readonly showModal = signal(false); // Controla la visibilidad del modal
  readonly categoryId = signal<number | null>(null); // Almacena la ID de la categoría a eliminar
  readonly onReloadDelete = output<SubmitEvent>();
  private readonly _categoryService = inject(CategoryService);

  // Método para abrir el modal
  open(id: number) {
    this.categoryId.set(id);
    this.showModal.set(true);
  }

  // Método para cerrar el modal
  close() {
    this.showModal.set(false);
    this.categoryId.set(null);
  }

  // Método para confirmar la eliminación
  confirmDelete(event: any) {
    if (this.categoryId()) {
      this._categoryService.deleteCategory(this.categoryId()!).subscribe({
        next: (res) => {
          toast.success(res.message);
          this.onReloadDelete.emit(event);
          this.close();
        },
        error: (err) => {
          console.error(err);
          toast.error(err.error.message);
        },
      });
    }
  }
}
