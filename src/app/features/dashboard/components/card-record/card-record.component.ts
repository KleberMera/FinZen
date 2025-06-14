import { Component, computed, inject, signal } from '@angular/core';
import { StorageService } from '@services/storage.service';
import { SalaryService } from '../../services/salary.service';
import { format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { rxResource } from '@angular/core/rxjs-interop';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartRecordComponent, FinanceSummary } from "../chart-record/chart-record.component";

@Component({
  selector: 'app-card-record',
  imports: [CurrencyPipe, DecimalPipe, FormsModule, ChartRecordComponent],
  templateUrl: './card-record.component.html',
  styleUrl: './card-record.component.scss',
})
export class CardRecordComponent {
  protected readonly _storage = inject(StorageService);
  protected readonly _salaryService = inject(SalaryService);
  
  seletdUserId = signal(this._storage.getUserId());
  timeNow = signal<any>(new Date());
  
  // Configuración del rango de meses por defecto (últimos 2 meses)
  selectedMonthsRange = signal<number>(2);
  
  // Opciones de rango disponibles
  monthRangeOptions = [
    { label: 'Últimos 2 meses', value: 2 },
    { label: 'Últimos 3 meses', value: 3 },
    { label: 'Últimos 4 meses', value: 4 },
    { label: 'Últimos 6 meses', value: 6 },
    { label: 'Últimos 12 meses', value: 12 }
  ];

  // Lista para meses y años del filtro personalizado
  monthsList = [
    { label: 'Enero', value: 1 },
    { label: 'Febrero', value: 2 },
    { label: 'Marzo', value: 3 },
    { label: 'Abril', value: 4 },
    { label: 'Mayo', value: 5 },
    { label: 'Junio', value: 6 },
    { label: 'Julio', value: 7 },
    { label: 'Agosto', value: 8 },
    { label: 'Septiembre', value: 9 },
    { label: 'Octubre', value: 10 },
    { label: 'Noviembre', value: 11 },
    { label: 'Diciembre', value: 12 }
  ];

  // Generar lista de años (desde 5 años atrás hasta el año actual)
  yearsList = computed(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i);
    }
    return years;
  });

  // Signals para filtro personalizado
  customStartMonth = signal<number>(new Date().getMonth() + 1);
  customStartYear = signal<number>(new Date().getFullYear());
  customEndMonth = signal<number>(new Date().getMonth() + 1);
  customEndYear = signal<number>(new Date().getFullYear());

  // Flag para saber si estamos usando filtro personalizado
  isUsingCustomRange = signal<boolean>(false);

  // Cálculo de fechas de inicio basado en el rango seleccionado o personalizado
  startDate = computed(() => {
    if (this.isUsingCustomRange()) {
      // Usar fechas personalizadas
      return new Date(this.customStartYear(), this.customStartMonth() - 1, 1);
    } else {
      // Usar rango predefinido
      const monthsToSubtract = this.selectedMonthsRange() - 1;
      return subMonths(this.timeNow(), monthsToSubtract);
    }
  });

  endDate = computed(() => {
    if (this.isUsingCustomRange()) {
      // Usar fechas personalizadas
      return new Date(this.customEndYear(), this.customEndMonth() - 1, 1);
    } else {
      return this.timeNow();
    }
  });

  startMonth = computed(() => parseInt(format(this.startDate(), 'M')));
  startYear = computed(() => parseInt(format(this.startDate(), 'yyyy')));
  endMonth = computed(() => parseInt(format(this.endDate(), 'M')));
  endYear = computed(() => parseInt(format(this.endDate(), 'yyyy')));

  // Signal para mostrar/ocultar filtros
  showFilters = signal(false);

  // Current financial summary data with type
  currentFinancialSumary = rxResource({
    request: () => ({
      userId: this.seletdUserId(),
      startMonth: this.startMonth(),
      startYear: this.startYear(),
      endMonth: this.endMonth(),
      endYear: this.endYear()
    }),
    loader: ({ request }) => {
      return this._salaryService.getFinancialSummaryRange(
        request.userId,
        request.startMonth,
        request.startYear,
        request.endMonth,
        request.endYear
      );
    }
  });

  // Método para cambiar el rango de meses predefinido
  setMonthsRange(months: number): void {
    this.selectedMonthsRange.set(months);
    this.isUsingCustomRange.set(false);
  }

  // Método para aplicar filtro personalizado
  applyCustomRange(): void {
    // Validar que la fecha de inicio no sea posterior a la fecha de fin
    const startDate = new Date(this.customStartYear(), this.customStartMonth() - 1, 1);
    const endDate = new Date(this.customEndYear(), this.customEndMonth() - 1, 1);
    
    if (startDate > endDate) {
      // Mostrar error o intercambiar fechas
      const tempMonth = this.customStartMonth();
      const tempYear = this.customStartYear();
      
      this.customStartMonth.set(this.customEndMonth());
      this.customStartYear.set(this.customEndYear());
      this.customEndMonth.set(tempMonth);
      this.customEndYear.set(tempYear);
    }
    
    this.isUsingCustomRange.set(true);
    console.log('Applied custom range:', {
      start: `${this.customStartMonth()}/${this.customStartYear()}`,
      end: `${this.customEndMonth()}/${this.customEndYear()}`
    }); // Debug
  }

  // Método para aplicar filtro automáticamente cuando cambian los selects
  onCustomDateChange(): void {
    if (this.isUsingCustomRange()) {
      // Si ya estamos en modo personalizado, aplicar cambios inmediatamente
      this.applyCustomRange();
    }
  }

  // Método para restablecer a valores por defecto
  resetToDefault(): void {
    this.selectedMonthsRange.set(2);
    this.isUsingCustomRange.set(false);
    
    // Resetear valores del filtro personalizado
    const now = new Date();
    this.customStartMonth.set(now.getMonth() + 1);
    this.customStartYear.set(now.getFullYear());
    this.customEndMonth.set(now.getMonth() + 1);
    this.customEndYear.set(now.getFullYear());
  }

  // Computed para obtener estadísticas generales
  totalStats = computed(() => {
    const data = this.currentFinancialSumary.value()?.data;
    if (!data || data.length === 0) return null;

    return {
      totalIncome: data.reduce((sum, month) => sum + month.totalIncome, 0),
      totalExpenses: data.reduce((sum, month) => sum + month.totalExpenses, 0),
      totalDebtPaid: data.reduce((sum, month) => sum + month.totalDebtPaid, 0),
      totalGoalContributions: data.reduce((sum, month) => sum + month.totalGoalContributionPaid, 0),
      totalExpensesWithDebtAndGoals: data.reduce((sum, month) => sum + month.totalExpensesWithDebtAndGoals, 0),
      averageNetBalance: data.reduce((sum, month) => sum + month.netBalance, 0) / data.length,
      monthsCount: data.length
    };
  });

  // Computed para mostrar el período actual en el título
  currentPeriodDisplay = computed(() => {
    if (this.isUsingCustomRange()) {
      const startMonthValue = this.customStartMonth();
      const endMonthValue = this.customEndMonth();
      const startYearValue = this.customStartYear();
      const endYearValue = this.customEndYear();
      
      // Asegurarse de que los valores de los meses son válidos (entre 1 y 12)
      if (startMonthValue < 1 || startMonthValue > 12 || endMonthValue < 1 || endMonthValue > 12) {
        return 'Período inválido';
      }

      // Obtener los nombres de los meses
      const startMonthName = this.monthsList[startMonthValue - 1]?.label;
      const endMonthName = this.monthsList[endMonthValue - 1]?.label;

      if (!startMonthName || !endMonthName) {
        return 'Período inválido';
      }
      
      if (startYearValue === endYearValue && startMonthValue === endMonthValue) {
        return `${startMonthName} ${startYearValue}`;
      } else if (startYearValue === endYearValue) {
        return `${startMonthName} - ${endMonthName} ${startYearValue}`;
      } else {
        return `${startMonthName} ${startYearValue} - ${endMonthName} ${endYearValue}`;
      }
    } else {
      return `${this.selectedMonthsRange()} últimos meses`;
    }
  });

  // Método para inicializar fechas personalizadas con valores por defecto
  private initializeCustomDates(): void {
    const now = new Date();
    const twoMonthsAgo = subMonths(now, 1);
    
    this.customStartMonth.set(twoMonthsAgo.getMonth() + 1);
    this.customStartYear.set(twoMonthsAgo.getFullYear());
    this.customEndMonth.set(now.getMonth() + 1);
    this.customEndYear.set(now.getFullYear());
  }

  constructor() {
    this.initializeCustomDates();
  }
}