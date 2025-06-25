import { Component, computed, effect, inject, signal } from '@angular/core';
import { GraficsService } from '../../services/grafics.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { format } from '@formkit/tempo';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-card-movements',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './card-movements.component.html',
  styleUrl: './card-movements.component.scss',
})
export class CardMovementsComponent {
  private readonly _graficsService = inject(GraficsService);
  private readonly _storage = inject(StorageService);
  lenguaje = signal<string>('es');
  timeNow = signal<any>(new Date());

  currentMonth = signal<any>(format(this.timeNow(), 'MM', this.lenguaje()));
  currenMonthName = signal<any>(format(this.timeNow(), 'MMMM', this.lenguaje()));
  currentYear = signal<any>(format(this.timeNow(), 'YYYY', this.lenguaje()));
  userId = signal<number>(this._storage.getUserId());

  grafics = rxResource({
    request: () => ({ userId: this.userId() }),
    loader: ({ request }) =>
      this._graficsService.getGraficWeeklYByUserId(request.userId),
  });

  graficMonth = rxResource({
    request: () => ({ userId: this.userId(), currentMonth: this.currentMonth(), currentYear: this.currentYear() }),
    loader: ({ request }) =>
      this._graficsService.getGraficMonthlySummaryByUserId(request.userId, { startMonth: request.currentMonth, startYear: request.currentYear }),
  });

  tab = signal<'week' | 'month'>('week');
  private barChart: Chart | null = null;
  private lineChart: Chart | null = null;
  
  // Colors for the chart
  private readonly COLORS = {
    gasto: '#ef4444',
    ingreso: '#10b981'
  };

  constructor() {
    effect(() => {
      if (this.tab() === 'week') {
        const data = this.grafics.value()?.data;
        if (data && data.length > 0) {
          if (this.barChart) {
            this.barChart.destroy();
            this.barChart = null;
          }
          setTimeout(() => this.createBarChart(), 0);
        }
        // Limpia el otro chart si cambia de tab
        if (this.lineChart) {
          this.lineChart.destroy();
          this.lineChart = null;
        }
      } else if (this.tab() === 'month') {
        const data = this.graficMonth.value()?.data;
        if (data && data.length > 0) {
          if (this.lineChart) {
            this.lineChart.destroy();
            this.lineChart = null;
          }
          setTimeout(() => this.createLineChart(), 0);
        }
        // Limpia el otro chart si cambia de tab
        if (this.barChart) {
          this.barChart.destroy();
          this.barChart = null;
        }
      }
    });
  }

  // Add this method to your component class
hasBothExpenseAndIncome(): boolean {
  const data = this.graficMonth.value()?.data;
  if (!data) return false;
  const hasExpense = data.some((d: any) => d.expense || d.gasto);
  const hasIncome = data.some((d: any) => d.income || d.ingreso);
  return hasExpense && hasIncome;
}

  private createBarChart() {
    const data = this.grafics.value()?.data || [];
    const ctx = document.getElementById('weeklyMovementsChart') as HTMLCanvasElement;
    
    if (!ctx) return;

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(item => item.day),
        datasets: [
          {
            label: 'Gastos',
            data: data.map(item => item.gasto || 0),
            backgroundColor: this.COLORS.gasto,
            borderRadius: 6,
            borderWidth: 1
          },
          {
            label: 'Ingresos',
            data: data.map(item => item.ingreso || 0),
            backgroundColor: this.COLORS.ingreso,
            borderRadius: 6,
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6b7280'
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: '#6b7280'
            }
          }
        },
        plugins: {
         legend: {
            position: 'top',
            labels: {
              color: '#6b7280',
              usePointStyle: true,
              padding: 20
            }
          },tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: { size: 14 },
            bodyFont: { size: 14 },
            padding: 12,
            cornerRadius: 8
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        animation: {
          duration: 800,
          easing: 'easeInOutQuart'
        }
      }
    });
  }

  private createLineChart() {
    const data = this.graficMonth.value()?.data || [];
    const ctx = document.getElementById('monthlyMovementsChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(item => item.month || item.day),
        datasets: [
          {
            label: 'Gastos',
            data: data.map(item => item.expense ?? item.gasto ?? 0),
            borderColor: 'rgba(239, 68, 68, 1)',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointBackgroundColor: 'rgba(239, 68, 68, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 8,
            pointStyle: 'circle' // <-- Asegura puntos redondos
          },
          {
            label: 'Ingresos',
            data: data.map(item => item.income ?? item.ingreso ?? 0),
            borderColor: 'rgba(16, 185, 129, 1)',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointBackgroundColor: 'rgba(16, 185, 129, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 8,
            pointStyle: 'circle' // <-- Asegura puntos redondos
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
  legend: {
            position: 'top',
            labels: {
              color: '#6b7280',
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            titleColor: '#f1f5f9',
            bodyColor: '#e2e8f0',
            borderColor: '#374151',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: (context: any) => {
                return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Mes',
              color: '#64748b',
              font: { size: 14 }
            },
            grid: { display: false }, // Sin cuadrícula vertical
            ticks: {
              color: '#64748b',
              font: { size: 12 }
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Monto ($)',
              color: '#64748b',
              font: { size: 14 }
            },
            grid: { display: false }, // Sin cuadrícula horizontal
            ticks: {
              color: '#64748b',
              font: { size: 12 },
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            },
            beginAtZero: true
          }
        },
        elements: {
          line: { borderJoinStyle: 'round' },
          point: { hoverBorderWidth: 3, pointStyle: 'circle' }
        }
      }
    });
  }


  getTotalGastos() {
    return this.grafics.value()?.data!.reduce((total, item) => total + (item.gasto || 0), 0);
  }

  getTotalIngresos() {  
    return this.grafics.value()?.data!.reduce((total, item) => total + (item.ingreso || 0), 0);
  }

  hasMovements(): boolean {
    if (!this.grafics.value()?.data) return false;
    
    return this.grafics.value()!.data!.some(day => day.gasto > 0 || day.ingreso > 0);
  }
}
