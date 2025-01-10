
import {
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Debt } from '@models/debt';

@Component({
  selector: 'filters-debt',
  imports: [FormsModule],
  templateUrl: './filters-debt.component.html',
  styleUrl: './filters-debt.component.scss',
})
export class FiltersDebtComponent {
  // Input signal para las transacciones
  readonly debts = input.required<Debt[]>();

  // Output event para los filtros
  readonly filterChange = output<{
    name: string;
  }>();

  protected readonly nameFilter = signal<string| null>(null);

  protected readonly uniqueNames = computed(() => {
    return [...new Set(this.debts().map((t) => t.name))];
  });

 // protected readonly types = ['Ingreso', 'Gasto'];

  constructor() {
    // Observar cambios en los filtros y emitirlos
    effect(() => {
      if (this.nameFilter() !== null) {
        this.filterChange.emit({
          name: this.nameFilter() as string,
        });
      }
    });

    document.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[id$="-dropdown"]')) {
        document.querySelectorAll('[id$="-dropdown-menu"]').forEach((menu) => {
          menu.classList.add('hidden');
        });
      }
    });
  }

  toggleDropdown(dropdownId: 'name'): void {
    const menu = document.getElementById(`${dropdownId}-dropdown-menu`);
    const allMenus = document.querySelectorAll('[id$="-dropdown-menu"]');

    allMenus.forEach((element) => {
      if (element.id !== `${dropdownId}-dropdown-menu`) {
        element.classList.add('hidden');
      }
    });

    menu?.classList.toggle('hidden');
  }
}
