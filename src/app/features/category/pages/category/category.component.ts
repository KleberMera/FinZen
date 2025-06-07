import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { Category } from '@models/category';
import { StorageService } from '@services/storage.service';
import { CategoryService } from '../../services/category.service';
import { FormCategoryComponent } from '../../components/form-category/form-category.component';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormCategoryComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export default class CategoryComponent {
  private _categoryService = inject(CategoryService);
  private _storageService = inject(StorageService);
  private _router = inject(Router);
  isFormOpen = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  selectedCategory = signal<Category | null>(null);

  protected readonly selectedUser = signal<number>(
    this._storageService.getUserId()
  );
  protected readonly form = this._categoryService.formCategory();
  protected activeTab = signal<'Ingreso' | 'Gasto'>('Gasto');

  public categoriasResource = rxResource({
    request: () => ({ userId: this.selectedUser() }),
    loader: ({ request }) =>
      this._categoryService.getCategoriesByUserId(request.userId),
  });

  // Filtrar categorías por tipo
  filteredCategories = computed(() => {
    const categories = this.categoriasResource.value()?.data || [];
    return categories.filter((cat: any) => cat.type === this.activeTab());
  });

  // Cambiar pestaña activa
  setActiveTab(tab: 'Ingreso' | 'Gasto') {
    this.activeTab.set(tab);
  }

  onReload() {
    this.categoriasResource.reload();
    this.isFormOpen.set(false);
  }

  deleteCategory(id: number) {
    const catPromise = firstValueFrom(this._categoryService.deleteCategory(id));
    toast.promise(catPromise, {
      loading: 'Eliminando categoría...',
      success: (res) => {
        this.onReload();
        return res.message;
      },
    });
  }
  toggleForm(category?: Category) {
    if (category) {
      this.isEditMode.set(true);
      this.selectedCategory.set(category);
    } else {
      this.isEditMode.set(false);
      this.selectedCategory.set(null);
    }
    this.isFormOpen.set(!this.isFormOpen());
  }

  editCategory(category: Category) {
    this.toggleForm(category);
  }

  handleFormClose() {
    this.isFormOpen.set(false);
    this.isEditMode.set(false);
    this.selectedCategory.set(null);
  }
}
