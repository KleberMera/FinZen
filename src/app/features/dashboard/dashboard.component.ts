import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DashboardHeaderComponent } from "./components/dashboard-header/dashboard-header.component";
import { CardNotificationComponent } from "./components/card-notification/card-notification.component";
import { CardGoalsComponent } from "./components/card-goals/card-goals.component";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { CardDebtSummaryComponent } from "./components/card-debt-summary/card-debt-summary.component";
import { CardCategoriesDistributionComponent } from "./components/card-categories-distribution/card-categories-distribution.component";
import { TimelineTransactionComponent } from "./components/timeline-transaction/timeline-transaction.component";
import { AdvancedGraficsComponent } from "./components/advanced-grafics/advanced-grafics.component";



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
  imports: [CommonModule, DashboardHeaderComponent, CardNotificationComponent, CardGoalsComponent, CalendarComponent, CardDebtSummaryComponent, CardCategoriesDistributionComponent, TimelineTransactionComponent, AdvancedGraficsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export default class DashboardComponent {
  // Datos aleatorios

// Estado para notificaciones

daysBeforeNotify: number = 2;

// Datos del calendario



// Datos financieros
debtSummary?: DebtSummary;
categoryDistribution: CategoryDistribution[] = [];
recentTransactions: Transaction[] = [];
savingGoals: SavingGoal[] = [];



ngOnInit(): void {
  this.initializeData();
 // this.generateCalendar();
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





private loadNotificationPreferences(): void {
 
}



getTransactionClass(amount: number): string {
  return amount > 0 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';
}

// Manejadores de eventos

onTogglePushNotifications(enabled: boolean): void {
  
}

onUpdateNotificationDays(days: number): void {
 
}

onAddSavingGoal(): void {
  // Implementar lógica para agregar nueva meta
}
}
