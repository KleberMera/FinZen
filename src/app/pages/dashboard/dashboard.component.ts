import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DashboardHeaderComponent } from "./components/dashboard-header/dashboard-header.component";
interface CalendarDay {
  date: number;
  hasPayment: boolean;
  isToday: boolean;
  payments?: Payment[];
}

interface Payment {
  id: number;
  amount: number;
  description: string;
  dueDate: string;
}

interface DebtSummary {
  totalDebt: number;
  nextPaymentDate: string;
  nextPaymentAmount: number;
  totalPending: number;
}

interface CategoryDistribution {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

interface Transaction {
  id: number;
  name: string;
  amount: number;
  category: string;
  date: string;
  type: 'ingreso' | 'gasto';
}

interface SavingGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  progress: number;
}
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DashboardHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  // Datos aleatorios

// Estado para notificaciones
pushEnabled: boolean = false;
daysBeforeNotify: number = 2;

// Datos del calendario
calendarDays: CalendarDay[] = [];
selectedPeriod: '30' | '60' | '90' = '30';

// Datos financieros
debtSummary?: DebtSummary;
categoryDistribution: CategoryDistribution[] = [];
recentTransactions: Transaction[] = [];
savingGoals: SavingGoal[] = [];



ngOnInit(): void {
  this.initializeData();
  this.generateCalendar();
  this.loadNotificationPreferences();
}

private initializeData(): void {
  // Cargar resumen de deudas
  this.loadDebtSummary();
  // Cargar distribución de categorías
  this.loadCategoryDistribution();
  // Cargar transacciones recientes
  this.loadRecentTransactions();
  // Cargar metas de ahorro
  this.loadSavingGoals();
}

private loadDebtSummary(): void {
 
}

private loadCategoryDistribution(): void {
 
}

private loadRecentTransactions(): void {
  
}

private loadSavingGoals(): void {
 
}

private generateCalendar(): void {
  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  this.calendarDays = Array.from({ length: daysInMonth }, (_, i) => ({
    date: i + 1,
    hasPayment: false,
    isToday: i + 1 === today.getDate(),
    payments: []
  }));

  // Cargar pagos del mes
  this.loadMonthlyPayments();
}

private loadMonthlyPayments(): void {
 
}

private loadNotificationPreferences(): void {
 
}

// Métodos de utilidad para la UI
getDayClass(day: CalendarDay): string {
  return `
    w-full h-full 
    ${day.isToday ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-gray-50 dark:bg-gray-700/50'} 
    ${day.hasPayment ? 'ring-2 ring-amber-500 dark:ring-amber-400' : ''} 
    rounded-lg cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-900/20
    transition-all duration-200
  `;
}

getTransactionClass(amount: number): string {
  return amount > 0 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';
}

// Manejadores de eventos
onPeriodChange(period: '30' | '60' | '90'): void {
  this.selectedPeriod = period;
  this.loadMonthlyPayments();
}

onTogglePushNotifications(enabled: boolean): void {
  
}

onUpdateNotificationDays(days: number): void {
 
}

onAddSavingGoal(): void {
  // Implementar lógica para agregar nueva meta
}
}
