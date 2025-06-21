import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { dayEnd, format, monthEnd, monthStart } from '@formkit/tempo';
import { StorageService } from '../../../../shared/services/storage.service';
import { SalaryService } from '../../../dashboard/services/salary.service';
import { apiResponse } from '@models/apiResponse';
import { CurrencyPipe, NgClass } from '@angular/common';
import { FinanceSummary } from '@models/finance';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-card-salary-transaction',
  imports: [CurrencyPipe],
  templateUrl: './card-salary-transaction.component.html',
  styleUrl: './card-salary-transaction.component.scss',
})
export class CardSalaryTransactionComponent {
  private readonly _storageService = inject(StorageService);
  private readonly _salaryService = inject(SalaryService);

  protected readonly seletedUser = signal<number>(
    this._storageService.getUserId()
  );
  public readonly stateReset = signal(false);

  lenguaje = signal<string>('es');
  timeNow = signal<any>(new Date());

  currentMonth = computed(() =>
    format(this.timeNow(), 'MMMM', this.lenguaje())
  );

  currentMonthNumber = computed(() =>
    format(this.timeNow(), 'M', this.lenguaje())
  );
  currenDate = computed(() =>
    format(this.timeNow(), 'YYYY-MM-DD', this.lenguaje())
  );
  currenYear = computed(() => format(this.timeNow(), 'YYYY', this.lenguaje()));

  salaryData = rxResource<
    apiResponse<FinanceSummary>,
    { userId: number; currentMonth: number; year: number }
  >({
    request: () => ({
      userId: this.seletedUser(),
      currentMonth: parseInt(this.currentMonthNumber()),
      year: parseInt(this.currenYear()),
    }),
    loader: ({ request }) =>
      this._salaryService.getFinancialSummary(
        request.userId,
        request.currentMonth,
        request.year
      ),
  });

  private doughnutChart: Chart | null = null;

  constructor() {
    effect(() => {
      if (this.stateReset() === true) {
        this.salaryData.reload();
        this.stateReset.set(false);
      }
      // Redibujar gráfico cuando cambian los datos
      const data = this.salaryData.value()?.data;
      if (data) {
        setTimeout(() => this.createDoughnutChart(), 0);
      }
    });
  }

  private createDoughnutChart() {
    const data = this.salaryData.value()?.data;
    const ctx = document.getElementById('salarySummaryChart') as HTMLCanvasElement;
    if (!ctx || !data) return;
    if (this.doughnutChart) {
      this.doughnutChart.destroy();
      this.doughnutChart = null;
    }

    // Definición de colores y estilos
    const colorActual = '#2563eb';
    const colorEsperado = '#fb923c';
    const colorDias = '#22c55e';
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const trackColor = isDark ? '#334155' : '#f3f4f6';

    // Plugin para texto central dentro del canvas
    const centerTextPlugin = {
      id: 'centerText',
      afterDraw: (chart: any) => {
        const { ctx, chartArea, width, height } = chart;
        ctx.save();
        // Calcula el centro del canvas
        const centerX = width / 2;
        const centerY = height / 2;
        // Calcula tamaño de fuente relativo al canvas
        const valueFontSize = Math.round(height / 7);
        const labelFontSize = Math.round(height / 18);
        // Obtiene valor y etiqueta
        let value = '0';
        let label = '';
        switch (this.activeMetric()) {
          case 'actual':
            value = parseFloat(String(data.expensePercentage)).toFixed(2);
            label = 'Gastos actuales';
            break;
          case 'expected':
            value = parseFloat(String(data.timeAdjustedExpensePercentage)).toFixed(2);
            label = 'Gastos esperados';
            break;
          case 'days':
            value = parseFloat(String(data.daysPassedPercentage)).toFixed(2);
            label = 'Días transcurridos';
            break;
        }
        // Detecta dark mode
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        // Valor central
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `bold ${valueFontSize}px sans-serif`;
        ctx.fillStyle = isDark ? '#fff' : '#1f2937';
        ctx.shadowColor = isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)';
        ctx.shadowBlur = 2;
        ctx.fillText(value + '%', centerX, centerY - valueFontSize/5);
        ctx.shadowBlur = 0;
        // Etiqueta
        ctx.font = `normal ${labelFontSize}px sans-serif`;
        ctx.fillStyle = isDark ? '#cbd5e1' : '#64748b';
        ctx.fillText(label, centerX, centerY + valueFontSize/1.2);
        ctx.restore();
      }
    };

    this.doughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Gastado', 'Esperado', 'Días'],
        datasets: [
          {
            label: 'Gastos actuales',
            data: [data.expensePercentage, 100 - data.expensePercentage],
            backgroundColor: [colorActual, trackColor],
            borderWidth: 0,
            weight: 1,
            circumference: 360,
            rotation: -90,
            hoverOffset: 4,
          },
          {
            label: 'Gastos esperados',
            data: [data.timeAdjustedExpensePercentage, 100 - data.timeAdjustedExpensePercentage],
            backgroundColor: [colorEsperado, trackColor],
            borderWidth: 0,
            weight: 0.7,
            circumference: 360,
            rotation: -90,
            hoverOffset: 4,
          },
          {
            label: 'Días transcurridos',
            data: [data.daysPassedPercentage, 100 - data.daysPassedPercentage],
            backgroundColor: [colorDias, trackColor],
            borderWidth: 0,
            weight: 0.4,
            circumference: 360,
            rotation: -90,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 10,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: function(context) {
                const value = context.parsed || 0;
                return `${value.toFixed(2)}%`;
              },
              title: function(context) {
                return context[0].dataset.label;
              }
            }
          },
        },
        onHover: (event, elements) => {
          if (elements && elements.length > 0) {
            const datasetIndex = elements[0].datasetIndex;
            switch (datasetIndex) {
              case 0:
                this.setActiveMetric('actual');
                break;
              case 1:
                this.setActiveMetric('expected');
                break;
              case 2:
                this.setActiveMetric('days');
                break;
            }
          }
        },
        cutout: '70%',
      },
      plugins: [centerTextPlugin],
    });
  }

  ngOnDestroy(): void {
    if (this.doughnutChart) {
      this.doughnutChart.destroy();
      this.doughnutChart = null;
    }
  }

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  isFormVisible = signal<boolean>(false);
  toggleFormVisibility(): void {
    const visible = !this.isFormVisible();
    this.isFormVisible.set(visible);
    if (visible) {
      // Espera a que el DOM pinte el canvas
      setTimeout(() => this.createDoughnutChart(), 0);
    } else {
      // Destruye el gráfico si existe
      if (this.doughnutChart) {
        this.doughnutChart.destroy();
        this.doughnutChart = null;
      }
    }}

  activeMetric = signal<'actual' | 'expected' | 'days'>('actual');

  setActiveMetric(metric: 'actual' | 'expected' | 'days') {
    this.activeMetric.set(metric);
    // Fuerza actualización inmediata del gráfico si existe
    if (this.doughnutChart) {
      this.doughnutChart.update();
    }
  }

  displayPercentage(): string {
    const data = this.salaryData.value()?.data;
    if (!data) return '0';

    switch (this.activeMetric()) {
      case 'actual':
        return parseFloat(String(data.expensePercentage)).toFixed(2);
      case 'expected':
        return parseFloat(String(data.timeAdjustedExpensePercentage)).toFixed(2);
      case 'days':
        return parseFloat(String(data.daysPassedPercentage)).toFixed(2);
      default:
        return '0';
    }
  }

  activeMetricLabel(): string {
    switch (this.activeMetric()) {
      case 'actual':
        return 'Gastos actuales';
      case 'expected':
        return 'Gastos esperados';
      case 'days':
        return 'Días transcurridos';
      default:
        return '';
    }
  }

  getRecommendationClass(): string {
    const expensePercentage = parseFloat(String(this.salaryData.value()?.data!.expensePercentage));
    if (expensePercentage < 50) {
      return 'bg-cyan-900/20 text-cyan-400';
    } else if (expensePercentage < 80) {
      return 'bg-yellow-900/20 text-yellow-400';
    } else {
      return 'bg-red-900/20 text-red-400';
    }
  }
  
  getRecommendationIconClass(): string {
    const expensePercentage = parseFloat(String(this.salaryData.value()?.data!.expensePercentage));
    if (expensePercentage < 50) {
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-500';
    } else if (expensePercentage < 80) {
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500';
    } else {
      return 'bg-red-100 dark:bg-red-900/30 text-red-500';
    }
  }

  getRecommendationIcon(): string {
    const expensePercentage = parseFloat(String(this.salaryData.value()?.data!.expensePercentage));
    if (expensePercentage < 50) {
      return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
    } else if (expensePercentage < 80) {
      return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
    } else {
      return 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getCurrentDay(): number {
    return dayEnd(this.timeNow()).getDate();
  }
  
  //Primer día del mes
  getFirstDayOfMonth(): number {
    return monthStart(this.timeNow()).getDate();
  }

  getDaysInMonth(): number {
    return monthEnd(this.timeNow()).getDate();
  }
}
