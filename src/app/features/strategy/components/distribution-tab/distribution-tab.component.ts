import { Component, type OnInit, inject, effect } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Chart, registerables } from "chart.js"
import { DebtDataService } from "../../services/debt-data.service"
import { DebtCalculatorService } from "../../services/debt-calculator.service"

Chart.register(...registerables)

@Component({
  selector: "app-distribution-tab",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./distribution-tab.component.html",
})
export class DistributionTabComponent implements OnInit {
  private debtDataService = inject(DebtDataService)
  private calculatorService = inject(DebtCalculatorService)

  // Access signals directly from the service
  debtData = this.debtDataService.debtData
  processedDebts = this.debtDataService.processedDebts
  paymentPlan = this.debtDataService.paymentPlan

  private chart: Chart | null = null

  // Colors for the charts
  COLORS = ["#ff6b6b", "#4ecdc4", "#ffd166", "#8a2be2", "#20b2aa", "#ff7f50"]

  get debtCompletionDates() {
    return this.calculatorService.findDebtCompletionDates(this.paymentPlan(), this.processedDebts())
  }

  get sortedDebtsByMethod() {
    if (this.debtData()!.method === "bola-de-nieve") {
      return [...this.processedDebts()].sort((a, b) => a.remainingAmount - b.remainingAmount)
    } else {
      return [...this.processedDebts()].sort(
        (a, b) => Number.parseFloat(b.interest_rate || "0") - Number.parseFloat(a.interest_rate || "0"),
      )
    }
  }

  ngOnInit(): void {
    this.createChart()

    // Update the chart when the processed debts change
 
  }

  constructor() {
    effect(() => {
      this.processedDebts() // access the signal to track changes
      this.updateChart()
    })
  }

  createChart(): void {
    const pieData = this.calculatorService.calculatePieData(this.processedDebts())

    if (pieData.length === 0) return

    const ctx = document.getElementById("distributionChart") as HTMLCanvasElement
    if (!ctx) return

    // Prepare data for Chart.js
    this.chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: pieData.map((d) => d.name),
        datasets: [
          {
            data: pieData.map((d) => d.value),
            backgroundColor: this.COLORS.slice(0, pieData.length),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                const percentage = Math.round((value * 100) / total)
                return `${context.label}: $${value.toFixed(2)} (${percentage}%)`
              },
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

    const pieData = this.calculatorService.calculatePieData(this.processedDebts())

    if (pieData.length === 0) {
      this.chart.destroy()
      this.chart = null
      return
    }

    this.chart.data.labels = pieData.map((d) => d.name)
    this.chart.data.datasets[0].data = pieData.map((d) => d.value)
    this.chart.data.datasets[0].backgroundColor = this.COLORS.slice(0, pieData.length)

    this.chart.update()
  }
}
