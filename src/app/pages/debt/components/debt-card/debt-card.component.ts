import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Debt } from '@models/debt';

@Component({
  selector: 'app-debt-card',
  imports: [DatePipe],
  templateUrl: './debt-card.component.html',
  styleUrl: './debt-card.component.scss',
})
export class DebtCardComponent {
  debt = input.required<Debt>();

  protected getStatusClasses(): string {
    const baseClasses =
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    return this.debt().status === 'Pagado'
      ? `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`
      : `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`;
  }
}
