import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Transaction } from '@models/transaction';

@Component({
  selector: 'filters-transaction',
  imports: [FormsModule],
  templateUrl: './filters-transaction.component.html',
  styleUrl: './filters-transaction.component.scss'
})
export class FiltersTransactionComponent {
  // Input signal para las transacciones
  readonly transactions = input.required<Transaction[]>();
  readonly nameDropdownOpen = signal(false);
  readonly categoryDropdownOpen = signal(false);
  readonly typeDropdownOpen = signal(false);

  toggleDropdown(type: 'name' | 'category' | 'type'): void {
    if (type === 'name') {
      this.nameDropdownOpen.update(value => !value);
    }
    if (type === 'category') {
      this.categoryDropdownOpen.update(value => !value);
    }
    if (type === 'type') {
      this.typeDropdownOpen.update(value => !value);
    }
  }

  // Output event para los filtros
  readonly filterChange = output<{
    category: string;
    name: string;
    type: string;
  }>();

  // Signals para los filtros
  protected readonly categoryFilter = signal<string>('');
  protected readonly nameFilter = signal<string>('');
  protected readonly typeFilter = signal<string>('');

  // Signals computadas para las opciones
  protected readonly uniqueCategories = computed(() => {
    return [...new Set(this.transactions().map(t => t.category?.name ?? ''))].filter(Boolean);
  });

  protected readonly uniqueNames = computed(() => {
    return [...new Set(this.transactions().map(t => t.name))];
  });

  protected readonly types = ['Ingreso', 'Gasto'];

  constructor() {
    // Observar cambios en los filtros y emitirlos
    effect(() => {
      this.filterChange.emit({
        category: this.categoryFilter(),
        name: this.nameFilter(),
        type: this.typeFilter()
      });
    });
  }

 
}
