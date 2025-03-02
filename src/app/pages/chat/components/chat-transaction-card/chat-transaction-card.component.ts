import { Component, input } from '@angular/core';
import { Transaction } from '@models/transaction';

@Component({
  selector: 'app-chat-transaction-card',
  imports: [],
  templateUrl: './chat-transaction-card.component.html',
  styleUrl: './chat-transaction-card.component.scss'
})
export class ChatTransactionCardComponent {
  readonly transaction = input.required<Transaction >();
  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  }
}
