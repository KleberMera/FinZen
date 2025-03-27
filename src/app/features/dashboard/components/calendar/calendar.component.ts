import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
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

@Component({
  selector: 'app-calendar',
  imports: [NgFor, NgIf],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {


  ngOnInit(): void {
    //this.initializeData();
   this.generateCalendar();
    //this.loadNotificationPreferences();
  }
  calendarDays: CalendarDay[] = [];
  selectedPeriod: '30' | '60' | '90' = '30';

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


  onPeriodChange(period: '30' | '60' | '90'): void {
    this.selectedPeriod = period;
    this.loadMonthlyPayments();
  }
  
  private loadMonthlyPayments(): void {
   
  }
  
}
