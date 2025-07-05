import { Component, type OnInit, inject, effect } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Chart, registerables } from "chart.js"
import { DebtDataService } from "../../services/debt-data.service"
import { DebtCalculatorService } from "../../services/debt-calculator.service"

// Register all Chart.js components
Chart.register(...registerables)

@Component({
  selector: "app-chart-tab",
  imports: [CommonModule],
  templateUrl: "./chart-tab.component.html",
})
export class ChartTabComponent implements OnInit {
  private debtDataService = inject(DebtDataService)
  private calculatorService = inject(DebtCalculatorService)

  // Access signals directly from the service
  paymentPlan = this.debtDataService.paymentPlan
  processedDebts = this.debtDataService.processedDebts

  private chart: Chart | null = null

  // Colors for the charts
  public COLORS = ["#ff6b6b", "#4ecdc4", "#ffd166", "#8a2be2", "#20b2aa", "#ff7f50"]

  constructor() {
    effect(() => {
      // The effect will run whenever paymentPlan signal changes
      const _ = this.paymentPlan()
      this.updateChart()
    })
  }

  ngOnInit(): void {
    this.createChart()
  }

  createChart(): void {
    const chartData = this.calculatorService.calculateChartData(this.paymentPlan())

    if (chartData.length === 0) return

    const ctx = document.getElementById("debtChart") as HTMLCanvasElement
    if (!ctx) return

    // Prepare data for Chart.js
    const labels = chartData.map((d) => d.month)
    const datasets = this.processedDebts().map((debt, index) => ({
      label: debt.name,
      data: chartData.map((d) => d[debt.name] || 0),
      borderWidth: 1,
    }))

    this.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Deuda Restante ($)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Mes",
            },
          },
        },
        plugins: {
          colors: {
            forceOverride: true
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`,
            },
          },
        },
      },
    })
  }

  updateChart(): void {
    if (!this.chart) {
      this.createChart()
      return
    }

    const chartData = this.calculatorService.calculateChartData(this.paymentPlan())

    if (chartData.length === 0) {
      this.chart.destroy()
      this.chart = null
      return
    }

    this.chart.data.labels = chartData.map((d) => d.month)
    this.chart.data.datasets = this.processedDebts().map((debt, index) => ({
      label: debt.name,
      data: chartData.map((d) => d[debt.name] || 0),
      backgroundColor: this.COLORS[index % this.COLORS.length],
      borderColor: this.COLORS[index % this.COLORS.length],
      borderWidth: 1,
    }))

    this.chart.update()
  }
}
