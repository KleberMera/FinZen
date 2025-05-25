import { Component, computed, effect, inject, signal } from '@angular/core';
import { GraficsService } from '../../../../services/grafics.service';
import { format } from '@formkit/tempo';
import { rxResource } from '@angular/core/rxjs-interop';
import { Chart, registerables } from 'chart.js';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-expense-distribution-trend',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './expense-distribution-trend.component.html',
  styleUrl: './expense-distribution-trend.component.scss'
})
export class ExpenseDistributionTrendComponent {
  protected readonly _graficsService = inject(GraficsService);
  Math = Math;
  lenguaje = signal<string>('es');
  timeNow = signal<Date>(new Date());

  // Lista de meses
  months = signal([
    { value: '01', name: 'Enero' },
    { value: '02', name: 'Febrero' },
    { value: '03', name: 'Marzo' },
    { value: '04', name: 'Abril' },
    { value: '05', name: 'Mayo' },
    { value: '06', name: 'Junio' },
    { value: '07', name: 'Julio' },
    { value: '08', name: 'Agosto' },
    { value: '09', name: 'Septiembre' },
    { value: '10', name: 'Octubre' },
    { value: '11', name: 'Noviembre' },
    { value: '12', name: 'Diciembre' }
  ]);

  // Años disponibles (últimos 5 años y próximos 5)
  years = computed(() => Array.from({ length: 10 }, (_, i) => (this.timeNow().getFullYear() - 5 + i).toString()));

  // Señales para fechas de inicio y fin
  startMonth = signal<string>(format(new Date(this.timeNow().getFullYear(), this.timeNow().getMonth() - 2, 1), 'MM', this.lenguaje()));
  startYear = signal<string>(format(this.timeNow(), 'YYYY', this.lenguaje()));
  endMonth = signal<string>(format(this.timeNow(), 'MM', this.lenguaje()));
  endYear = signal<string>(format(this.timeNow(), 'YYYY', this.lenguaje()));

  // Señales computadas para nombres de meses
  startMonthName = computed(() => {
    const month = this.months().find(m => m.value === this.startMonth());
    return month ? month.name : '';
  });

  endMonthName = computed(() => {
    const month = this.months().find(m => m.value === this.endMonth());
    return month ? month.name : '';
  });

  // Método para actualizar los datos cuando cambian las fechas
  updateDateRange() {
    // Asegurarse de que los valores son strings antes de pasarlos al servicio
    const startMonth = this.startMonth().toString().padStart(2, '0');
    const startYear = this.startYear().toString();
    const endMonth = this.endMonth().toString().padStart(2, '0');
    const endYear = this.endYear().toString();
    
    // Actualizar las señales con los valores formateados
    this.startMonth.set(startMonth);
    this.startYear.set(startYear);
    this.endMonth.set(endMonth);
    this.endYear.set(endYear);
    
    // Recargar los datos
    this.expenseDistributionTrend.reload();
  }

  expenseDistributionTrend = rxResource({
    request: () => ({ 
      startMonth: Number(this.startMonth()), 
      startYear: Number(this.startYear()),
      endMonth: Number(this.endMonth()),
      endYear: Number(this.endYear())
    }),
    loader: ({ request }) => this._graficsService.getExpenseDistributionTrend(
      request.startMonth, 
      request.startYear, 
      request.endMonth, 
      request.endYear
    )
  });

  private areaChart: Chart | null = null;
  
  // Categorías seleccionadas
  selectedCategories = signal<Set<string>>(new Set());
  allCategories = signal<string[]>([]);

  // Colores para el gráfico de área
  COLORS = [
    'rgba(255, 107, 107, 0.8)',
    'rgba(78, 205, 196, 0.8)',
    'rgba(255, 209, 102, 0.8)',
    'rgba(138, 43, 226, 0.8)',
    'rgba(32, 178, 170, 0.8)',
    'rgba(255, 127, 80, 0.8)',
    'rgba(50, 205, 50, 0.8)',
    'rgba(255, 105, 180, 0.8)'
  ];

  BORDER_COLORS = [
    'rgba(255, 107, 107, 1)',
    'rgba(78, 205, 196, 1)',
    'rgba(255, 209, 102, 1)',
    'rgba(138, 43, 226, 1)',
    'rgba(32, 178, 170, 1)',
    'rgba(255, 127, 80, 1)',
    'rgba(50, 205, 50, 1)',
    'rgba(255, 105, 180, 1)'
  ];

  constructor() {
    // Escuchar cambios en los datos del gráfico
    effect(() => {
      const data = this.expenseDistributionTrend.value()?.data;
      if (data) {
        // Destruir el gráfico anterior si existe
        if (this.areaChart) {
          this.areaChart.destroy();
          this.areaChart = null;
        }
        // Crear el nuevo gráfico
        setTimeout(() => this.createAreaChart(), 0);
      }
    });
  }

  createAreaChart(): void {
    const responseData = this.expenseDistributionTrend.value()?.data;
    console.log('Datos del gráfico de tendencia:', responseData);
    
    if (!responseData?.trendData || responseData.trendData.length === 0) {
      console.warn('No hay datos de tendencia para mostrar en el gráfico');
      return;
    }

    const ctx = document.getElementById('expenseTrendChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('No se encontró el elemento canvas con id "expenseTrendChart"');
      return;
    }

    // Procesar datos para el gráfico de área
    const trendData = responseData.trendData;
    
    // Obtener todos los períodos únicos y ordenarlos
    const periods = [...new Set(trendData.map((item: any) => item.period))].sort();
    
    // Obtener todas las categorías únicas
    const categories = [...new Set(trendData.map((item: any) => item.categoryName))];
    
    // Actualizar las categorías disponibles
    this.allCategories.set(categories);
    
    // Si no hay categorías seleccionadas o las categorías seleccionadas ya no existen, seleccionar las 3 primeras por defecto
    const currentSelected = this.selectedCategories();
    const hasValidSelections = Array.from(currentSelected).some(cat => categories.includes(cat));
    
    if ((currentSelected.size === 0 || !hasValidSelections) && categories.length > 0) {
      const defaultCategories = new Set(categories.slice(0, Math.min(3, categories.length)));
      this.selectedCategories.set(defaultCategories);
    }
    
    // Crear datasets solo para las categorías seleccionadas
    const categoriesToShow = categories.filter(cat => this.selectedCategories().has(cat));
    
    const datasets = categoriesToShow.map((categoryName) => {
      const categoryData = periods.map(period => {
        const dataPoint = trendData.find((item: any) => 
          item.period === period && item.categoryName === categoryName
        );
        return dataPoint ? dataPoint.totalAmount : 0;
      });

      // Obtener el color de la categoría usando el mismo método que en los botones
      const categoryColor = this.getCategoryColor(categoryName).replace('1)', '0.8)');
      const borderColor = this.getCategoryColor(categoryName);

      return {
        label: categoryName,
        data: categoryData,
        backgroundColor: categoryColor,
        borderColor: borderColor,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: borderColor,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      };
    });

    // Formatear etiquetas de períodos (ej: "2025-02" -> "Feb 2025")
    const formattedLabels = periods.map(period => {
      const [year, month] = period.split('-');
      const monthName = this.months().find(m => m.value === month)?.name || month;
      return `${monthName} ${year}`;
    });

    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.areaChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: formattedLabels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false // Ocultamos la leyenda por defecto porque crearemos una personalizada
          },
          // legend: {
          //   position: 'top',
          //   labels: {
          //     usePointStyle: true,
          //     padding: 20,
          //     color: isDarkMode ? '#e2e8f0' : '#334155',
          //     font: {
          //       size: 12,
          //       //weight: '500'
          //     }
          //   }
          // },
          tooltip: {
            backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            titleColor: isDarkMode ? '#f1f5f9' : '#1f2937',
            bodyColor: isDarkMode ? '#e2e8f0' : '#374151',
            borderColor: isDarkMode ? '#374151' : '#d1d5db',
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
              text: 'Período',
              color: isDarkMode ? '#94a3b8' : '#64748b',
              font: {
                size: 14,
                //weight: '600'
              }
            },
            grid: {
              color: isDarkMode ? '#374151' : '#e5e7eb',
             // drawBorder: false
            },
            ticks: {
              color: isDarkMode ? '#94a3b8' : '#64748b',
              font: {
                size: 12
              }
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Monto ($)',
              color: isDarkMode ? '#94a3b8' : '#64748b',
              font: {
                size: 14,
                //weight: '600'
              }
            },
            grid: {
              color: isDarkMode ? '#374151' : '#e5e7eb',
              //drawBorder: false
            },
            ticks: {
              color: isDarkMode ? '#94a3b8' : '#64748b',
              font: {
                size: 12
              },
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            },
            beginAtZero: true
          }
        },
        elements: {
          line: {
            borderJoinStyle: 'round'
          },
          point: {
            hoverBorderWidth: 3
          }
        }
      }
    });
  }

  // Método para obtener el color de una categoría específica
  getCategoryColor(categoryName: string): string {
    // Obtener el índice de la categoría en la lista completa de categorías
    const categoryIndex = this.allCategories().indexOf(categoryName);
    // Asegurarse de que el índice esté dentro del rango de colores disponibles
    const colorIndex = categoryIndex % this.COLORS.length;
    return this.COLORS[colorIndex].replace('0.8', '1'); // Usar versión opaca para los indicadores
  }

  // Método para alternar una categoría seleccionada
  toggleCategory(category: string): void {
    const selected = new Set(this.selectedCategories());
    if (selected.has(category)) {
      selected.delete(category);
      // Asegurarse de que al menos una categoría esté seleccionada
      if (selected.size === 0 && this.allCategories().length > 0) {
        // Si era la última categoría, no permitir deseleccionar
        return;
      }
    } else {
      selected.add(category);
    }
    this.selectedCategories.set(selected);
    
    // Recrear el gráfico con las categorías actualizadas
    if (this.areaChart) {
      this.areaChart.destroy();
      this.areaChart = null;
    }
    setTimeout(() => this.createAreaChart(), 0);
  }

  // Métodos para obtener resúmenes
  getTotalExpensesTrend(): number {
    const summary = this.expenseDistributionTrend.value()?.data?.summary;
    return summary?.reduce((sum: number, item: any) => sum + Number(item.totalAmount || 0), 0) || 0;
  }

  getTotalTransactionsTrend(): number {
    const summary = this.expenseDistributionTrend.value()?.data?.summary;
    return summary?.reduce((sum: number, item: any) => sum + Number(item.transactionCount || 0), 0) || 0;
  }

  getTotalCategoriesTrend(): number {
    const summary = this.expenseDistributionTrend.value()?.data?.summary;
    return summary?.length || 0;
  }

  getTotalUsersTrend(): number {
    const summary = this.expenseDistributionTrend.value()?.data?.summary;
    return summary?.reduce((sum: number, item: any) => sum + Number(item.userCount || 0), 0) || 0;
  }

}
