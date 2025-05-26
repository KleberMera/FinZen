import { Component, computed, inject, signal } from '@angular/core';
import { GraficsService } from '../../../../services/grafics.service';
import { format } from '@formkit/tempo';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Period } from '@models/grafic';

@Component({
  selector: 'app-transaction-statics',
  imports: [CommonModule, FormsModule, CurrencyPipe, NgClass],
  templateUrl: './transaction-statics.component.html',
  styleUrl: './transaction-statics.component.scss',
})
export class TransactionStaticsComponent {
  protected readonly _graficsService = inject(GraficsService);
  Math = Math;
  lenguaje = signal<string>('es');
  timeNow = signal<Date>(new Date());
  
  // Lista de meses
  months = signal(this._graficsService.getMonth());
  
  // Años disponibles (últimos 5 años y próximos 5)
  years = computed(() => Array.from({ length: 10 }, (_, i) => (this.timeNow().getFullYear() - 5 + i).toString()));

  // Señales para fechas de inicio (obligatorias)
  currentMonth = signal<string>(format(this.timeNow(), 'MM', this.lenguaje()));
  currentYear = signal<string>(format(this.timeNow(), 'YYYY', this.lenguaje()));
  
  // Señales para fechas de fin (opcionales)
  endMonth = signal<string | null>(null);
  endYear = signal<string | null>(null);
  
  // Señal para controlar si se muestran los controles de fecha de fin
  showEndDateControls = signal<boolean>(false);
  
  // Señal para controlar la pestaña activa ('resumen' o el índice del período)
  activeTab = signal<string | number>('resumen');

  // Señales computadas para nombres de meses
  currentMonthName = computed(() => {
    const month = this.months().find(m => m.value === this.currentMonth());
    return month ? month.name : '';
  });

  endMonthName = computed(() => {
    if (!this.endMonth()) return '';
    const month = this.months().find(m => m.value === this.endMonth());
    return month ? month.name : '';
  });

  // Método para actualizar los datos cuando cambian las fechas
  updateDate() {
    // Asegurarse de que los valores son strings antes de pasarlos al servicio
    const month = this.currentMonth().toString().padStart(2, '0');
    const year = this.currentYear().toString();
    
    // Actualizar las señales con los valores formateados
    this.currentMonth.set(month);
    this.currentYear.set(year);
    
    // Si hay fechas de fin, también formatearlas
    if (this.showEndDateControls()) {
      if (this.endMonth()) {
        const endMonth = this.endMonth()!.toString().padStart(2, '0');
        this.endMonth.set(endMonth);
      }
      
      if (this.endYear()) {
        const endYear = this.endYear()!.toString();
        this.endYear.set(endYear);
      }
      
      // Solo recargar si tanto el mes como el año final están definidos
      if (this.endMonth() && this.endYear()) {
        this.transactionStatistics.reload();
      }
    } else {
      // Si no está en modo comparación, recargar normalmente
      this.transactionStatistics.reload();
    }
  }

  // Método para alternar la visibilidad de los controles de fecha de fin
  toggleEndDateControls() {
    this.showEndDateControls.set(!this.showEndDateControls());
    if (!this.showEndDateControls()) {
      // Si se ocultan los controles, limpiar las fechas de fin
      this.endMonth.set(null);
      this.endYear.set(null);
      this.updateDate();
    }
  }

  transactionStatistics = rxResource({
    request: () => {
      const request: any = {
        month: Number(this.currentMonth()),
        year: Number(this.currentYear()),
      };
      
      // Agregar fechas de fin si están definidas
      if (this.endMonth()) {
        request.endMonth = Number(this.endMonth());
      }
      if (this.endYear()) {
        request.endYear = Number(this.endYear());
      }
      
      return request;
    },
    loader: ({ request }) => this._graficsService.getTransactionStatistics(request),
  });

  // Método para cambiar la pestaña activa
  setActiveTab(tab: string | number) {
    this.activeTab.set(tab);
  }

  // Verificar si una pestaña está activa
  isTabActive(tab: string | number): boolean {
    return this.activeTab() === tab;
  }

  // Obtener el período actual
  getCurrentPeriod() {
    if (this.activeTab() === 'resumen') {
      return this.transactionStatistics.value()?.data?.total;
    }
    const index = Number(this.activeTab());
    return this.transactionStatistics.value()?.data?.periods?.[index];
  }

  // Métodos para obtener totales
  getTotalTransactions(period?: Period): number {
    const target = period || this.getCurrentPeriod();
    return target?.totalTransactions || 0;
  }

  getTotalIncome(period?: Period): number {
    const target = period || this.getCurrentPeriod();
    return target?.income?.total || 0;
  }

  getTotalExpense(period?: Period): number {
    const target = period || this.getCurrentPeriod();
    return target?.expense?.total || 0;
  }


  getTotalTransactionIncome(period?: Period): number {
    const target = period || this.getCurrentPeriod();
    return target?.income?.transactions || 0;
  }


  getTotalTransactionExpense(period?: Period): number {
    const target = period || this.getCurrentPeriod();
    return target?.expense?.transactions || 0;
  }


  getTotalBalance(period?: Period): number {
    const target = period || this.getCurrentPeriod();
    return target?.balance || 0;
  }
  
  // Método para obtener el color del balance


  getTotalWithReceipt(period?: Period): number {
    const target = period || this.getCurrentPeriod();
    return target?.transactionsWithReceipt || 0;
  }

  getTotalWithoutReceipt(period?: Period): number {
    const target = period || this.getCurrentPeriod();
    return target?.transactionsWithoutReceipt || 0;
  }

  // Método para obtener el porcentaje de transacciones con recibo
  getReceiptPercentage(period?: Period): number {
    const total = this.getTotalTransactions(period);
    const withReceipt = this.getTotalWithReceipt(period);
    return total > 0 ? (withReceipt / total) * 100 : 0;
  }

  // Método para determinar el color del balance
  getBalanceColor(): string {
    const balance = this.getTotalBalance();
    if (balance > 0) return 'text-green-600 dark:text-green-400';
    if (balance < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  }

  // Método para obtener el ícono del balance
  getBalanceIcon(balance?: number): string {
    const balanceValue = balance !== undefined ? balance : this.getTotalBalance();
    if (balanceValue > 0) return 'pi pi-arrow-up';
    if (balanceValue < 0) return 'pi pi-arrow-down';
    return 'pi pi-minus';
  }
}
