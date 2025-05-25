import { Component, computed, effect, inject, signal } from '@angular/core';
import { GraficsService } from '../../../../services/grafics.service';
import { format } from '@formkit/tempo';
import { rxResource } from '@angular/core/rxjs-interop';
import { Chart, registerables } from 'chart.js';
import { CurrencyPipe, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
Chart.register(...registerables);
@Component({
  selector: 'app-expense-distribution',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './expense-distribution.component.html',
  styleUrl: './expense-distribution.component.scss'
})
export class ExpenseDistributionComponent {
  protected readonly _graficsService = inject(GraficsService);
  Math = Math
  lenguaje = signal<string>('es');
  timeNow = signal<Date>(new Date());
  currentPage = signal<number>(0);
  itemsPerPage = signal<number>(3);

  // Lista de meses
  months = signal(this._graficsService.getMonth());
  // Años disponibles (últimos 5 años y próximos 5)
  years = computed(() => Array.from({ length: 10 }, (_, i) => (this.timeNow().getFullYear() - 5 + i).toString()));

  // Señales para mes y año seleccionados
  selectedMonth = signal<string>(format(this.timeNow(), 'MM', this.lenguaje()));
  selectedYear = signal<string>(format(this.timeNow(), 'YYYY', this.lenguaje()));

  // Señal computada para el nombre del mes seleccionado
  selectedMonthName = computed(() => {
    const month = this.months().find(m => m.value === this.selectedMonth());
    return month ? month.name : '';
  });

  // Método para actualizar los datos cuando cambia el mes o año
  updateDate() {
    this.currentPage.set(0); // Reiniciar a la primera página
    // Asegurarse de que los valores son strings antes de pasarlos al servicio
    const month = this.selectedMonth().toString().padStart(2, '0');
    const year = this.selectedYear().toString();
    
    // Actualizar las señales con los valores formateados
    this.selectedMonth.set(month);
    this.selectedYear.set(year);
    
    // Recargar los datos
    this.expenseDistribution.reload();
  }

  // Get the current page of categories to display
  getVisibleItems() {
    const startIndex = this.currentPage() * this.itemsPerPage();
    return this.expenseDistribution.value()?.data?.slice(startIndex, startIndex + this.itemsPerPage()) || [];
  }

  // Navigate to the next page of categories
  nextItems() {
    const totalPages = Math.ceil((this.expenseDistribution.value()?.data?.length || 0) / this.itemsPerPage());
    if (this.currentPage() < totalPages - 1) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  // Navigate to the previous page of categories
  previousItems() {
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  expenseDistribution = rxResource({
    request: () => ({ 
      month: Number(this.selectedMonth()), 
      year: Number(this.selectedYear()) 
    }),
    loader: ({ request }) => this._graficsService.getExpenseDistributionByMonth(request.month, request.year)  
  });

  private pieChart: Chart | null = null;

  // Colores para el gráfico
  COLORS = ['#ff6b6b', '#4ecdc4', '#ffd166', '#8a2be2', '#20b2aa', '#ff7f50', '#32cd32', '#ff69b4'];

  constructor() {
    // Escuchar cambios en los datos del gráfico
    effect(() => {
      const data = this.expenseDistribution.value()?.data;
      if (data) {
        // Destruir el gráfico anterior si existe
        if (this.pieChart) {
          this.pieChart.destroy();
          this.pieChart = null;
        }
        // Crear el nuevo gráfico
        setTimeout(() => this.createPieChart(), 0);
      }
    });
  }

  


  createPieChart(): void {
    const data = this.expenseDistribution.value()?.data;
    console.log('Datos del gráfico:', data);
    
    if (!data || data.length === 0) {
      console.warn('No hay datos para mostrar en el gráfico');
      return;
    }

    const ctx = document.getElementById('expensePieChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('No se encontró el elemento canvas con id "expensePieChart"');
      return;
    }

    // Preparar datos para Chart.js
    const labels = data.map((item: any) => item.categoryName);
    const amounts = data.map((item: any) => Number(item.totalAmount));
    const percentages = data.map((item: any) => Number(item.percentage));

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: amounts,
          backgroundColor: this.COLORS.slice(0, data.length),
          borderColor: '#30353d',
          borderWidth: 2,
          hoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // Ocultamos la leyenda por defecto porque crearemos una personalizada
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const item = data[context.dataIndex];
                return `${item.categoryName}: $${item.totalAmount.toFixed(2)} (${item.percentage.toFixed(1)}%)`;
              }
            }
          }
        }
      }
    });
  }


  // Método para obtener el color de una categoría específica
  getCategoryColor(index: number): string {
    return this.COLORS[index % this.COLORS.length];
  }

  // Resumen total
  getTotalExpenses(): number {
    return this.expenseDistribution.value()?.data?.reduce(
      (sum: number, item: any) => sum + Number(item.totalAmount || 0), 
      0
    ) || 0;
  }

  getTotalTransactions(): number {
    return this.expenseDistribution.value()?.data?.reduce(
      (sum: number, item: any) => sum + Number(item.transactionCount || 0), 
      0
    ) || 0;
  }

  getTotalCategories(): number {
    return this.expenseDistribution.value()?.data!.length || 0;
  }


}
