import { Component, inject, output, signal } from '@angular/core';
import { CloseIconComponent } from '../../../../shared/icons/close-icon/close-icon.component';
import { CategoryService } from '../../services/category.service';
import { toast } from 'ngx-sonner';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'Modalcategory',
  imports: [ReactiveFormsModule, CloseIconComponent],
  templateUrl: './modal-category.component.html',
  styleUrl: './modal-category.component.scss',
})
export class ModalCategoryComponent {
  readonly onReload = output<SubmitEvent>();
  readonly showModalForm = signal(false);
  readonly userid = signal<number | null>(null);
  readonly showMoreIcons = signal<boolean | null>(false);

  private _categService = inject(CategoryService);

  protected readonly icons = this._categService.getPrimeIcons();
  protected form = this._categService.formCategory();

  openModal(id: number) {
    this.userid.set(id);
    this.showModalForm.set(true);
  }

  closeModal() {
    this.showModalForm.set(false);
    this.userid.set(null);
  }

  async saveCategory(event: SubmitEvent) {
    if (this.form().invalid) {
      return;
    }
    this.form().patchValue({ user_id: this.userid() });
    const category = this.form().value;
    this._categService.createCategoria(category).subscribe({
      next: (res) => {
        toast.success(res.message);
        this.closeModal();
        this.onReload.emit(event);
        this.form().reset();
      },
      error: (err: HttpErrorResponse) => {
        toast.error(err.error.message);
      },
    });
  }
}
