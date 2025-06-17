import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Debt } from '@models/debt';
import { SidebarDebDetailsComponent } from '../sidebar-deb-details/sidebar-deb-details.component';
import { Amortization, UpdateAllStatusDto } from '@models/amortization';
import { DebtService } from '../../services/debt.service';
import { MethodService } from '../../services/method.service';
import { format } from '@formkit/tempo';
import { toast } from 'ngx-sonner';
import { DebtSidebarContainerComponent } from '../debt-sidebar-container/debt-sidebar-container.component';
import { BottomSheetComponent } from '../../../../shared/components/bottom-sheet';

@Component({
  selector: 'app-table-amortization',
  imports: [CurrencyPipe, DatePipe, BottomSheetComponent, SidebarDebDetailsComponent],
  templateUrl: './table-amortization.component.html',
  styleUrl: './table-amortization.component.scss',
})
export class TableAmortizationComponent {
  readonly totalMonths = signal<number>(0);
  readonly sortOrderStatus = signal<'asc' | 'desc' | null>(null);
  protected readonly _debtService = inject(DebtService);
  private readonly _methodService = inject(MethodService);
  readonly formData = input<FormGroup>();
  readonly filters = input<Debt[]>();
  updateSuccess = output<void>();

  protected readonly datos = computed(() => {
    const rawData = this.filters()
      ? this.filters()![0].amortizations
      : this.formData()?.get('amortizations')?.value || [];

    return [...rawData].sort((a, b) => {
      // Orden principal por número de mes
      const monthOrder = a.number_months - b.number_months;

      // Si hay sorting por estado aplicado
      if (this.sortOrderStatus()) {
        const statusOrder =
          a.status === b.status ? 0 : a.status === 'Pendiente' ? -1 : 1;
        // Aplica dirección del sort
        const statusMultiplier = this.sortOrderStatus() === 'asc' ? 1 : -1;

        // Prioriza el estado si hay sort activo
        return statusOrder !== 0 ? statusOrder * statusMultiplier : monthOrder;
      }

      // Orden por defecto (mes)
      return monthOrder;
    });
  });

  toggleStatusSort() {
    this.sortOrderStatus.update((current) =>
      current === null ? 'asc' : current === 'asc' ? 'desc' : null
    );
  }

  selectedAmortization = signal<Amortization | null>(null);
  debtId = signal<number>(0);
  isSidebarOpen = signal(false);
  readonly selectionMode = signal<boolean>(false);
  readonly selectedItems = signal<number[]>([]);

  ondebtClick(amortization: Amortization): void {
    if (this.selectionMode()) return; // No abrir sidebar en modo selección
    
    console.log('Recibido', amortization);
    const debtId = this.filters() ? this.filters()![0].id : this.formData()?.get('id')?.value;
    this.debtId.set(debtId);
    this.selectedAmortization.set(amortization);
    this.isSidebarOpen.set(true); // Abre el sidebar
  }

  // Método para cerrar el sidebar
  closeUserSidebar(): void {
    console.log('Cerrando sidebar...');
    this.isSidebarOpen.set(false); // Cierra el sidebar
    this.selectedAmortization.set(null); // Limpia la transacción seleccionada
    this.debtId.set(0);
  }

  // Método para manejar el evento de actualización del sidebar
  onSidebarUpdateSuccess(): void {
    this.updateSuccess.emit(); // Propaga el evento hacia ListDebtComponent
  }

  toggleSelectionMode() {
    this.selectionMode.update((mode) => !mode);
    if (!this.selectionMode()) {
      this.selectedItems.set([]);
    }
  }

  toggleSelection(amortization: Amortization, event: Event) {
    event.stopPropagation();
    if (amortization.status === 'Pagado') return;

    const currentSelected = this.selectedItems();
    const id = amortization.id!;

    if (currentSelected.includes(id)) {
      this.selectedItems.set(currentSelected.filter((item) => item !== id));
    } else {
      this.selectedItems.set([...currentSelected, id]);
    }
  }

  async onUpdateMultipleAmortizations() {
    const updateDto: UpdateAllStatusDto = {
      ids: this.selectedItems(),
      status: 'Pagado',
      payment_date: format(new Date(), 'YYYY-MM-DD', 'es'),
    };
    const debtId = this.filters() ? this.filters()![0].id : this.formData()?.get('id')?.value;
  
    this._debtService.updateDebtStatusAll(debtId, updateDto).subscribe({
      next: () => {
        toast.success('Pagos actualizados correctamente');
        this.updateSuccess.emit();
        this.selectedItems.set([]);
      },
    });
  }
}
