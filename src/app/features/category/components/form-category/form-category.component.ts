import { Component, computed, inject, input, output, signal, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { toast } from 'ngx-sonner';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StorageService } from '../../../../shared/services/storage.service';
import { firstValueFrom } from 'rxjs';
import { Category } from '@models/category';
import { BottomSheetContentComponent } from "../../../../shared/components/bottom-sheet-content/bottom-sheet-content.component";
import { TitleGradient } from '@models/styleClass';

@Component({
  selector: 'app-form-category',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, BottomSheetContentComponent],
  templateUrl: './form-category.component.html',
  styleUrl: './form-category.component.scss'
})
export class FormCategoryComponent implements OnInit {
  readonly onReload = output<SubmitEvent>();
  readonly onClose = output<void>();
  Object = Object;
  Title = TitleGradient;
  
  protected readonly isSubmitting = signal(false);
  category = input<Category | null>(null);
  isEditMode = input<boolean>(false);

  protected readonly _storage = inject(StorageService);
  readonly userid = signal<number | null>(this._storage.getUserId());
  readonly showMoreIcons = signal<boolean>(false);
  private _categService = inject(CategoryService);
  protected selectedCategory = signal<string | null>(null);

  // Obtener todas las categorías de iconos
  protected readonly iconCategories = this._categService.getPrimeIconsByCategory();
  
  // Obtener todos los iconos inicialmente
  protected readonly allIcons = this._categService.getPrimeIcons();
  
  // Form reactive
  protected form = this._categService.formCategory(this.category() || undefined);

  // Computed para obtener iconos filtrados
  protected getIconsForDisplay = computed(() => {
    if (this.selectedCategory()) {
      return this._categService.getIconsByCategory(this.selectedCategory()!);
    }
    // Si no hay categoría seleccionada, mostrar todos los iconos
    return this.allIcons;
  });

  // Computed para iconos visibles (con paginación)
  protected visibleIcons = computed(() => {
    const icons = this.getIconsForDisplay();
    return this.showMoreIcons() ? icons : icons.slice(0, 10);
  });

  ngOnInit() {
    // If in edit mode and category is provided, patch the form with category data
    if (this.isEditMode() && this.category()) {
      this.form = this._categService.formCategory(this.category() || undefined);
      this.form().patchValue({
        ...this.category(),
        user_id: this.userid()
      });
    } else {
      this.form = this._categService.formCategory();
    }
  }

  // Método para seleccionar una categoría de iconos
  selectIconCategory(category: string) {
    this.selectedCategory.set(category);
    // Resetear la vista "mostrar más" cuando se cambia de categoría
    this.showMoreIcons.set(false);
  }

  // Método para limpiar el filtro de categoría
  clearCategoryFilter() {
    this.selectedCategory.set(null);
    this.showMoreIcons.set(false);
  }

  // Método para alternar mostrar más iconos
  toggleShowMoreIcons() {
    this.showMoreIcons.set(!this.showMoreIcons());
  }

  async saveCategory(event: SubmitEvent) {
    if (this.form().invalid || this.isSubmitting()) {
      return;
    }
    
    event.preventDefault();
    
    this.form().patchValue({ user_id: this.userid() });
    const category = this.form().value;
    
    try {
      if (this.isEditMode() && this.category()?.id) {
        await this.updateCategory(event);
      } else {
        this.isSubmitting.set(true);
        const catPromise = firstValueFrom(this._categService.createCategoria(category));
        toast.promise(catPromise, {
          loading: 'Guardando categoría...',
          success: (res) => {
            this.onReload.emit(event);
            this.form().reset();
            this.isSubmitting.set(false);
            this.onClose.emit();
            return res.message;
          },
          error: () => {
            this.isSubmitting.set(false);
            return 'Error al guardar la categoría';
          }
        });
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
  }

  async updateCategory(event: SubmitEvent) {
    if (this.form().invalid || !this.category()?.id) {
      return;
    }
    
    this.form().patchValue({ user_id: this.userid() });
    const category = this.form().value;
    
    const catPromise = firstValueFrom(
      this._categService.updateCategory(this.category()!.id!, category)
    );
    
    this.isSubmitting.set(true);
    toast.promise(catPromise, {
      loading: 'Actualizando categoría...',
      success: (res) => {
        this.onReload.emit(event);
        this.isSubmitting.set(false);
        this.form().reset();
        this.onClose.emit();
        return res.message;
      },
      error: () => {
        this.isSubmitting.set(false);
        return 'Error al actualizar la categoría';
      }
    });
  }
}