import { Component, inject, signal, effect } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { format } from '@formkit/tempo';
import { GraficsService } from '../../../services/grafics.service';
import { Chart, registerables } from 'chart.js';


// Register all Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-overview-admin',
  imports: [],
  templateUrl: './overview-admin.component.html',
  styleUrl: './overview-admin.component.scss',
})
export class OverviewAdminComponent {
  protected readonly _graficsService = inject(GraficsService);
  lenguaje = signal<string>('es');
  timeNow = signal<any>(new Date());

  currentMonth = signal<any>(format(this.timeNow(), 'MM', this.lenguaje()));
  currenMonthName = signal<any>(format(this.timeNow(), 'MMMM', this.lenguaje()));
  currentYear = signal<any>(format(this.timeNow(), 'YYYY', this.lenguaje()));

  expenseDistribution = rxResource({
    request: () => ({ month: this.currentMonth(), year: this.currentYear() }),
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
    const amounts = data.map((item: any) => item.totalAmount);
    const percentages = data.map((item: any) => item.percentage);

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: amounts,
          backgroundColor: this.COLORS.slice(0, data.length),
          borderColor: '#ffffff',
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

  //Resument tota 
  getTotalExpenses(): number {
    return this.expenseDistribution.value()?.data!.reduce((sum: number, item: any) => sum + item.totalAmount, 0) || 0;
  }

  getTotalTransactions(): number {
    return this.expenseDistribution.value()?.data!.reduce((sum: number, item: any) => sum + item.transactionCount, 0) || 0;
  }
}
