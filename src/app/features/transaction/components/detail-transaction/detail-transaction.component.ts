import { Component, output, input, inject, signal, effect, computed } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Transaction } from '@models/transaction';
import { TransactionService } from '../../services/transaction.service';
import { toast } from 'ngx-sonner';
import { StorageService } from '@services/storage.service';
import { CategoryName } from '@models/category';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom, NEVER } from 'rxjs';

@Component({
  selector: 'app-detail-transaction',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './detail-transaction.component.html',
  styleUrl: './detail-transaction.component.scss'
})
export class DetailTransactionComponent {
  closeUserSidebar = output<void>();
  deleteSuccess = output<void>();
  readonly transaction = input.required<Transaction>();
  
  private readonly _transactionService = inject(TransactionService);
  protected readonly _storageService = inject(StorageService);
  
  // Signals principales
  private readonly userId = signal<number>(this._storageService.getUserId());
  readonly selectedType = signal<string | null>(null);
  readonly isEditing = signal<boolean>(false);
  
  // Formulario reactivo
  readonly transactionForm = this._transactionService.formTransaction();
  
  // rxResource para categorías - solo consulta cuando hay tipo
  readonly categories = rxResource({
    request: () => ({ 
      userId: this.userId(), 
      type: this.selectedType() 
    }),
    loader: ({ request }) => 
      this.isTypeEmpty(request.type) 
        ? NEVER 
        : this._transactionService.getCategoryTypeByUserId(request.userId, request.type!),
  });

  // Computed para acceso fácil a las categorías
  readonly categoryOptions = computed(() => {
    const categoriesData = this.categories.value();
    return categoriesData?.data || [];
  });

   // Computed para verificar si el formulario es válido
   isFormValid = computed(() => {
    const form = this.transactionForm();
    return form.valid;
  });
  // Computed para la categoría actual de la transacción
  readonly currentCategory = computed(() => {
    const trans = this.transaction();
    const categories = this.categoryOptions();
    return categories.find((cat: CategoryName) => cat.id === trans.category_id) || trans.category;
  });

  constructor() {
    // Effect para inicializar el formulario cuando cambie la transacción
    effect(() => {
      const trans = this.transaction();
      if (trans && !this.isEditing()) {
        this.initializeForm(trans);
      }
    });

    // Effect para resetear categoría cuando cambie el tipo
    effect(() => {
      const type = this.selectedType();
      if (type && this.isEditing()) {
        // Solo resetear si estamos editando y el tipo cambió
     //   this.transactionForm().patchValue({ category_id: 0 });
      }
    });
  }

  // Métodos utilitarios
  private isTypeEmpty(type: string | null): boolean {
    return !type || type === null || type === '';
  }

  private initializeForm(transaction: Transaction): void {
    this.selectedType.set(transaction.category?.type || null);
    
    this.transactionForm().patchValue({
      category_id: transaction.category_id || 0,
      name: transaction.name || '',
      description: transaction.description || '',
      amount: transaction.amount || 0,
      date: transaction.date || '',
      time: transaction.time || new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    });
  }

  // Métodos de acción
  close(): void {
    this.closeUserSidebar.emit();
  }

  toggleEdit(): void {
    const wasEditing = this.isEditing();
    this.isEditing.set(!wasEditing);
    
    if (!wasEditing) {
      // Entrando en modo edición - inicializar formulario
      this.initializeForm(this.transaction());
    }
  }

  onTypeChange(type: 'Gasto' | 'Ingreso'): void {
    this.selectedType.set(type);
  }

  update(): void {
    // Validar formulario
    Object.values(this.transactionForm().controls).forEach(control => {
      control.markAsTouched();
    });
    
    if (this.transactionForm().invalid) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    const id = this.transaction().id;
    if (id === undefined) {
      toast.error('Error: ID de transacción no válido');
      return;
    }

    const formValue = this.transactionForm().getRawValue();
    const updatedTransaction: Transaction = {
      ...this.transaction(),
      ...formValue,
      id,
      category_id: Number(formValue.category_id) || 0,
      amount: Number(formValue.amount) || 0
    };

    const updatePromise = firstValueFrom(this._transactionService.updateTransaction(id, updatedTransaction));
    toast.promise(updatePromise, {
      loading: 'Actualizando transacción...',
      success: (res) => {
        this.isEditing.set(false);
        this.deleteSuccess.emit();
        return res.message;
      },
    });
  }

  delete(): void {
    const id = this.transaction().id;
    if (id !== undefined) {
      const deletePromise = firstValueFrom(this._transactionService.deleteTransaction(id));
      toast.promise(deletePromise, {
        loading: 'Eliminando transacción...',
        success: (res) => {
          this.close();
          this.deleteSuccess.emit();
          return res.message;
        },
      });
    }

    
  }

  // Métodos para descripción con items
  hasItemsList(description: string): boolean {
    return description.includes('\n-');
  }

  getDescriptionHeader(description: string): string {
    if (!this.hasItemsList(description)) return description;
    return description.split('\n-')[0].trim();
  }

  getItemsList(description: string): string[] {
    if (!this.hasItemsList(description)) return [];
    const items = description.split('\n-');
    return items.slice(1).map(item => item.trim());
  }
}
