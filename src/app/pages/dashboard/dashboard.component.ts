import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DashboardHeaderComponent } from "./components/dashboard-header/dashboard-header.component";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DashboardHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  // Datos aleatorios
lastSixMonths = this.getLastSixMonths();
chartData = this.generateChartData();
randomIncome = this.getRandomAmount(5000, 15000);
randomExpenses = this.getRandomAmount(3000, 8000);
netBalance = this.randomIncome - this.randomExpenses;

getRandomName() {
  const names = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez'];
  return names[Math.floor(Math.random() * names.length)];
}

randomPercentage() {
  return Math.floor(Math.random() * 20) + 1;
}

getRandomAmount(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

generateChartPoints() {
  const max = Math.max(...this.chartData.map(d => d.value));
  return this.chartData.map((d, i) => 
    `${50 + (i * 100)},${220 - (d.value / max * 200)}`
  ).join(' ');
}

getLastSixMonths() {
  const months = [];
  const date = new Date();
  for (let i = 5; i >= 0; i--) {
    const newDate = new Date(date.getFullYear(), date.getMonth() - i, 1);
    months.push(newDate.toLocaleString('default', { month: 'short' }));
  }
  return months;
}

generateChartData() {
  return this.lastSixMonths.map((month, index) => ({
    month,
    value: this.getRandomAmount(2000, 8000)
  }));
}

get maxValue() {
  return Math.max(...this.chartData.map(d => d.value));
}

getAverage(): number {
  return this.chartData.reduce((acc, val) => acc + val.value, 0) / this.chartData.length;
}

generateAreaPath(): string {
  const max = this.maxValue;
  return this.chartData.map((d, i) => 
    `${50 + (i * 100)},${220 - (d.value / max * 200)}`
  ).join(' L ');
}
}
