import { Component, computed, inject, output, signal } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { toast } from 'ngx-sonner';

import { ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '@services/storage.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-form-category',
  imports: [ReactiveFormsModule],
  templateUrl: './form-category.component.html',
  styleUrl: './form-category.component.scss'
})
export class FormCategoryComponent {
  readonly onReload = output<SubmitEvent>();

protected readonly _storage = inject(StorageService);
  readonly userid = signal<number | null>(this._storage.getUserId());
  readonly showMoreIcons = signal<boolean>(false);
  private _categService = inject(CategoryService);

  protected readonly icons = this._categService.getPrimeIcons();
  protected form = this._categService.formCategory();


  async saveCategory(event: SubmitEvent) {
    if (this.form().invalid) {
      return;
    }
    this.form().patchValue({ user_id: this.userid() });
    const category = this.form().value;
    const catPromise = firstValueFrom(this._categService.createCategoria(category));
    toast.promise(catPromise, {
      loading: 'Guardando categoría...',
      success: (res) => {
        this.onReload.emit(event);

        this.form().reset();
        return res.message;
      },
    });
  }
  protected visibleIcons = computed(() => {
    return this.showMoreIcons() ? this.icons : this.icons.slice(0, 10);
  });
  
}
