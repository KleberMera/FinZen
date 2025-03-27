import { Component, computed, effect, inject, signal } from '@angular/core';
import { GraficsService } from '../../services/grafics.service';
import { StorageService } from '@services/storage.service';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexTooltip,
  ApexFill,
  ApexPlotOptions,
  ApexGrid,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { NgClass } from '@angular/common';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  colors: string[];
  grid: ApexGrid;
};

@Component({
  selector: 'app-card-movements',
  imports: [NgApexchartsModule, NgClass],
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

  // Estado derivado de manera reactiva usando computed
  private data = computed(() => this.grafics.value()?.data || []);

  // Totales y balance calculados reactivamente
  totalIngresos = computed(() =>
    this.data().reduce((sum, item) => sum + item.ingreso, 0)
  );
  totalGastos = computed(() =>
    this.data().reduce((sum, item) => sum + item.gasto, 0)
  );
  balance = computed(() => this.totalIngresos() - this.totalGastos());

  // Opciones del gráfico calculadas reactivamente
  chartOptions = computed(() => this.createChartOptions(this.data()));

  // Método separado para crear las opciones del gráfico
  private createChartOptions(data: any[]): Partial<ChartOptions> {
    const diasAbreviados = data.map((item) => item.day.substring(0, 3));
    const ingresos = data.map((item) => item.ingreso);
    const gastos = data.map((item) => item.gasto);

    const maxValue = Math.max(...ingresos, ...gastos, 10); // Valor mínimo para evitar gráficos vacíos
    const isDarkMode =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    return {
      series: [
        { name: 'Ingresos', data: ingresos },
        { name: 'Gastos', data: gastos },
      ],
      chart: {
        type: 'bar',
        height: 190,
        stacked: false,
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'inherit',
        background: 'transparent',
        animations: {
          enabled: true,
          speed: 800,
          animateGradually: { enabled: true, delay: 150 },
          dynamicAnimation: { enabled: true, speed: 350 },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4,
          dataLabels: {
            position: 'top',
            maxItems: 100,
            hideOverflowingLabels: true,
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) =>
          typeof val === 'number' && val > 0 ? '$' + val.toFixed(0) : '',
        offsetY: -20,
        style: {
          fontSize: '10px',
          colors: [isDarkMode ? '#e2e8f0' : '#334155'],
        },
      },
      stroke: {
        show: false,
        width: 2,
        colors: ['transparent'],
      },
      grid: {
        borderColor: isDarkMode ? '#334155' : '#e2e8f0',
        strokeDashArray: 4,
        yaxis: { lines: { show: true } },
        xaxis: { lines: { show: false } },
      },
      xaxis: {
        categories: diasAbreviados,
        labels: {
          style: {
            colors: isDarkMode ? '#94a3b8' : '#64748b',
            fontSize: '12px',
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        max: maxValue * 1.2,
        labels: {
          style: {
            colors: isDarkMode ? '#94a3b8' : '#64748b',
            fontSize: '12px',
          },
          formatter: (val) => (val > 0 ? '$' + val.toFixed(0) : '0'),
        },
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
          stops: [0, 100],
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `$${val.toFixed(2)}`,
        },
        theme: isDarkMode ? 'dark' : 'light',
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        offsetY: -5,
        labels: {
          colors: isDarkMode ? '#e2e8f0' : '#334155',
        },
      },
      colors: ['#10b981', '#f43f5e'],
    };
  }
}
