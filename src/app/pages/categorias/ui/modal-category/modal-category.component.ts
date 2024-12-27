import { Component, inject, input, output, signal } from '@angular/core';
import { DiskIconComponent } from '../../../../shared/icons/disk-icon/disk-icon.component';
import { CloseIconComponent } from '../../../../shared/icons/close-icon/close-icon.component';
import { Modal } from 'flowbite';
import { CategoriasService } from '../../services/categorias.service';
import { StorageService } from '@services/storage.service';
import { toast } from 'ngx-sonner';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'Modalcategory',
  imports: [DiskIconComponent, CloseIconComponent, ReactiveFormsModule],
  templateUrl: './modal-category.component.html',
  styleUrl: './modal-category.component.scss',
})
export class ModalCategoryComponent {
  onReload = output<SubmitEvent>();
  readonly userid = input.required<number>();
  private _categService = inject(CategoriasService);
  //private _storageService = inject(StorageService);
  //protected readonly seletedUser = signal<number>(this._storageService.getUserId());
  protected form = this._categService.formCategory();

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
        console.log(err);
        toast.error(err.error.message);
      },
    });
  }
}
