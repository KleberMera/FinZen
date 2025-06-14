import { Component, OnChanges, SimpleChanges, ElementRef, AfterViewInit, OnDestroy, effect, input, viewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CurrencyPipe } from '@angular/common';

// FinanceSummary interface for type safety
export interface FinanceSummary {
  totalIncome: number;
  salaryAmount: number;
  otherIncome: number;
  totalExpenses: number;
  totalDebtPaid: number;
  totalGoalContributionPaid: number;
  totalExpensesWithDebtAndGoals: number;
  netBalance: number;
  expensePercentage: number;
  month: number;
  year: number;
  monthName: string;
  daysPassedPercentage?: number;
  expectedExpensesByTime?: number;
  timeAdjustedExpensePercentage?: number;
  recommendation?: string;
}

// Register Chart.js components
Chart.register(...registerables);

interface ChartData {
  labels: string[];
  incomeData: number[];
  expensesData: number[];
  netBalanceData: number[];
  months: string[];
}

@Component({
  selector: 'app-chart-record',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './chart-record.component.html',
  styleUrl: './chart-record.component.scss'
})
export class ChartRecordComponent implements AfterViewInit, OnDestroy {
  readonly financialData = input<FinanceSummary[]>([]);
  readonly chartCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('financialChart');
  
  private chart: Chart | null = null;
  
  // Colors for the chart
  private readonly COLORS = {
    income: '#10b981',
    expenses: '#ef4444',
    netBalance: '#3b82f6',
    background: 'rgba(255, 255, 255, 0.1)'
  };

  // ngOnChanges(changes: SimpleChanges): void {
  //   const financialData = this.financialData();
  //   if (changes['financialData'] && financialData && financialData.length > 0) {
  //     if (this.chart) {
  //       this.updateChart();
  //     } else if (this.chartCanvas()) {
  //       this.createChart();
  //     }
  //   }
  // }

  constructor() {
    effect(() => {
      console.log(this.financialData());
      if (this.financialData() && this.financialData().length > 0) {
        this.createChart();
      }
    });
  }

  ngAfterViewInit(): void {
    const financialData = this.financialData();
    if (financialData && financialData.length > 0) {
      this.updateChart();
    }
  }

  // Helper methods for template
  getTotalIncome(): number {
    const financialData = this.financialData();
    if (!financialData?.length) return 0;
    return financialData.reduce((sum, item) => sum + (item?.totalIncome || 0), 0);
  }

  getTotalExpenses(): number {
    const financialData = this.financialData();
    if (!financialData?.length) return 0;
    return financialData.reduce((sum, item) => sum + (item?.totalExpenses || 0), 0);
  }

  getAverageNetBalance(): number {
    const financialData = this.financialData();
    if (!financialData?.length) return 0;
    const sum = financialData.reduce((sum, item) => sum + (item?.netBalance || 0), 0);
    return sum / financialData.length;
  }

  private prepareChartData(): ChartData {
    const financialData = this.financialData();
    if (!financialData || financialData.length === 0) {
      return { labels: [], incomeData: [], expensesData: [], netBalanceData: [], months: [] };
    }

    // Sort data by year and month
    const sortedData = [...financialData].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    const labels = sortedData.map(item => `${item.monthName} ${item.year}`);
    const incomeData = sortedData.map(item => item.totalIncome);
    const expensesData = sortedData.map(item => item.totalExpenses);
    const netBalanceData = sortedData.map(item => item.netBalance);
    const months = sortedData.map(item => item.monthName);

    return { labels, incomeData, expensesData, netBalanceData, months };
  }

  private updateChart(): void {
    const financialData = this.financialData();
    if (!this.chart || !financialData || financialData.length === 0) {
      return;
    }

    const { labels, incomeData, expensesData, netBalanceData } = this.prepareChartData();

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = incomeData;
    this.chart.data.datasets[1].data = expensesData;
    this.chart.data.datasets[2].data = netBalanceData;
    this.chart.update();
  }

  private createChart(): void {
    const chartCanvas = this.chartCanvas();
    if (!chartCanvas?.nativeElement) return;

    // Skip if no data
    const financialData = this.financialData();
    if (!financialData || financialData.length === 0) {
      return;
    }

    const chartData = this.prepareChartData();

    // Create new chart
    this.chart = new Chart(chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Ingresos',
            data: chartData.incomeData,
            backgroundColor: this.COLORS.income,
            borderRadius: 4,
            borderWidth: 0,
            order: 3
          },
          {
            label: 'Gastos',
            data: chartData.expensesData,
            backgroundColor: this.COLORS.expenses,
            borderRadius: 4,
            borderWidth: 0,
            order: 2
          },
          {
            label: 'Balance Neto',
            data: chartData.netBalanceData,
            type: 'line',
            borderColor: this.COLORS.netBalance,
            borderWidth: 3,
            pointBackgroundColor: this.COLORS.netBalance,
            pointBorderColor: '#fff',
            pointHoverRadius: 5,
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHoverBackgroundColor: this.COLORS.netBalance,
            pointHoverBorderColor: '#fff',
            order: 1,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6b7280',
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: '#6b7280',
              callback: function(value: string | number) {
                const numValue = Number(value);
                return numValue >= 1000 ? (numValue / 1000).toFixed(0) + 'k' : numValue;
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#6b7280',
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            titleColor: '#fff',
            bodyColor: '#e5e7eb',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            usePointStyle: true,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        animation: {
          duration: 800,
          easing: 'easeInOutQuart'
        },
        layout: {
          padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
