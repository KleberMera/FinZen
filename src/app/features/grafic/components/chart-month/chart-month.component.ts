import { DOCUMENT } from '@angular/common';
import { Component, computed, Inject, input } from '@angular/core';
import { MonthlyDataItem } from '@models/grafic';
import { ApexOptions } from 'apexcharts';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexDataLabels,
  ApexLegend,
  ApexFill,
  ApexPlotOptions,
  ApexGrid,
  ApexTooltip,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  fill: ApexFill;
  plotOptions: ApexPlotOptions;
  colors: string[];
  grid: ApexGrid;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-chart-month',
  imports: [NgApexchartsModule],
  templateUrl: './chart-month.component.html',
  styleUrl: './chart-month.component.scss'
})
export class ChartMonthComponent {
  readonly chartData = input.required<MonthlyDataItem[]>();

  constructor(@Inject(DOCUMENT) private document: Document) {}

  readonly chartOptions = computed<ChartOptions>(() => {
    const data = this.chartData();
    const dataArray = Array.isArray(data) ? data : [data];
    const months = dataArray.map(item => `${item.month} ${item.year}`);
    const incomes = dataArray.map(item => item.income);
    const expenses = dataArray.map(item => item.expense);
    const isDarkMode = this.document.documentElement.classList.contains('dark');

    const maxValue = Math.max(...incomes, ...expenses, 10); // Valor mínimo para evitar gráficos vacíos

    return {
      series: [
        { name: 'Ingresos', data: incomes },
        { name: 'Gastos', data: expenses }
      ],
      chart: {
        type: 'bar',
        height: 350,
        stacked: false,
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'inherit',
        background: 'transparent',
        animations: {
          enabled: true,
          speed: 800,
          animateGradually: { enabled: true, delay: 150 },
          dynamicAnimation: { enabled: true, speed: 350 }
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4,
          dataLabels: {
            position: 'top',
            maxItems: 100,
            hideOverflowingLabels: true
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => typeof val === 'number' && val > 0 ? '$' + val.toFixed(0) : '',
        offsetY: -20,
        style: {
          fontSize: '10px',
          colors: [isDarkMode ? '#e2e8f0' : '#334155']
        }
      },
      stroke: {
        show: false,
        width: 2,
        colors: ['transparent']
      },
      grid: {
        borderColor: isDarkMode ? '#334155' : '#e2e8f0',
        strokeDashArray: 4,
        yaxis: { lines: { show: true } },
        xaxis: { lines: { show: false } }
      },
      xaxis: {
        categories: months,
        labels: {
          style: {
            colors: isDarkMode ? '#94a3b8' : '#64748b',
            fontSize: '12px'
          }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        max: maxValue * 1.2,
        labels: {
          style: {
            colors: isDarkMode ? '#94a3b8' : '#64748b',
            fontSize: '12px'
          },
          formatter: (val) => (val > 0 ? '$' + val.toFixed(0) : '0')
        }
      },
      fill: {
        opacity: 0.8,
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.2,
          gradientToColors: undefined,
          inverseColors: false,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [0, 100]
        }
      },
      tooltip: {
        y: {
          formatter: (val) => `$${val.toFixed(2)}`
        },
        theme: isDarkMode ? 'dark' : 'light'
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        offsetY: -5,
        labels: {
          colors: isDarkMode ? '#e2e8f0' : '#334155'
        }
      },
      colors: ['#10b981', '#f43f5e']
    };
  });

}
