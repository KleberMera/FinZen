import { Component, computed, effect, inject, signal } from '@angular/core';
import { GraficsService } from '../../services/grafics.service';
import { StorageService } from '@services/storage.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { Chart, registerables } from 'chart.js';

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

  userId = signal<number>(this._storage.getUserId());

  grafics = rxResource({
    request: () => ({ userId: this.userId() }),
    loader: ({ request }) =>
      this._graficsService.getGraficWeeklYByUserId(request.userId),
  });

  private barChart: Chart | null = null;
  
  // Colors for the chart
  private readonly COLORS = {
    gasto: '#ef4444',
    ingreso: '#10b981'
  };

  constructor() {
    // Watch for changes in the data and update the chart
    effect(() => {
      const data = this.grafics.value()?.data;
      if (data && data.length > 0) {
        // Destroy previous chart if exists
        if (this.barChart) {
          this.barChart.destroy();
          this.barChart = null;
        }
        // Create new chart
        setTimeout(() => this.createBarChart(), 0);
      }
    });
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
          },
          tooltip: {
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
