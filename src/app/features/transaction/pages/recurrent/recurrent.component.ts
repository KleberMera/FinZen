import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { TransactionService } from '../../services/transaction.service';
import { FormValidationService } from '@services/form-validation.service';
import { FormControl, FormsModule } from '@angular/forms';
import { CategoryName } from '@models/category';
import { NEVER } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CardRecurrentComponent } from "../../components/recurrent-components/card-recurrent/card-recurrent.component";

@Component({
  selector: 'app-recurrent',
  imports: [FormsModule, CardRecurrentComponent],
  templateUrl: './recurrent.component.html',
  styleUrl: './recurrent.component.scss',
})
export default class RecurrentComponent {
  private readonly _transactionService = inject(TransactionService);
  private readonly _storageService = inject(StorageService);
  protected readonly selectedUserId = signal<number>(
    this._storageService.getUserId()
  );
  // Señales para selecciones
  protected readonly selectedCategoryId = signal<string>('');
  protected readonly selectedTransactionId = signal<string>('');
  protected readonly selectedType = signal<string>('Ingreso');
  protected readonly isTypeDropdownOpen = signal(false);
  
  // Datos del usuario
 
  
  // Tipos disponibles (incluyendo 'Todos')
  protected readonly types = signal<string[]>(['Ingreso', 'Gasto']);
  
  // Recurso para categorías
  categories = rxResource({
    request: () => ({ 
      userId: this.selectedUserId(), 
      type: this.selectedType() === 'Todos' ? null : this.selectedType() 
    }),
    loader: ({ request }) =>
      this._transactionService.getCategoryTypeByUserId(
        request.userId,
        request.type!
      ),
  });
  
  // Recurso para transacciones
  transactions = rxResource({
    request: () => ({ categoryId: this.selectedCategoryId() }),
    loader: ({ request }) =>
      this.isSelectedCategoryEmpty(request.categoryId)
        ? NEVER
        : this._transactionService.getTransactionByCategoryId(Number(request.categoryId)),
  });
  
  // Categorías filtradas
  filteredCategories = computed(() => {
    return (this.categories.value()?.data as CategoryName[]) || [];
  });
  
  // Transacciones filtradas
  filteredTransactions = computed(() => {
    return (this.transactions.value()?.data as any[]) || [];
  });
  
  // Transacción seleccionada
  selectedTransaction = computed(() => {
    if (!this.selectedTransactionId() || !this.transactions.value()?.data) {
      return null;
    }
    
    return this.filteredTransactions().find(
      transaction => transaction.id.toString() === this.selectedTransactionId()
    );
  });
  
  constructor() {
    // Reiniciar la transacción seleccionada cuando cambie la categoría
    effect(() => {
      // Este efecto se activa cuando cambia selectedCategoryId
      if (this.selectedCategoryId()) {
        this.selectedTransactionId.set('');
      }
    });
    
    // Reiniciar la categoría seleccionada cuando cambie el tipo
    effect(() => {
      // Este efecto se activa cuando cambia selectedType
      this.selectedCategoryId.set('');
    });
    
    // Log para debug
    effect(() => {
      if (this.selectedTransaction()) {
        console.log('Transacción seleccionada:', this.selectedTransaction());
      }
    });
  }
  
  // Manejadores de cambios
  handleCategoryChange(categoryId: string): void {
    this.selectedCategoryId.set(categoryId);
  }
  
  handleTransactionChange(transactionId: string): void {
    this.selectedTransactionId.set(transactionId);
  }
  
  handleTypeChange(type: string): void {
    this.selectedType.set(type);
    this.isTypeDropdownOpen.set(false);
  }
  
  // Toggle para el dropdown de tipos
  toggleTypeDropdown(): void {
    this.isTypeDropdownOpen.set(!this.isTypeDropdownOpen());
  }
  
  // Verifica si hay categoría seleccionada
  isSelectedCategoryEmpty(id: string): boolean {
    return !id || id === '0' || id === '';
  }
}
