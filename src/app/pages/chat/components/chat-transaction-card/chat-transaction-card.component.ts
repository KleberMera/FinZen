import { NgClass, NgIf } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-chat-transaction-card',
  imports: [NgClass, NgIf],
  templateUrl: './chat-transaction-card.component.html',
  styleUrl: './chat-transaction-card.component.scss'
})
export class ChatTransactionCardComponent {
  readonly transaction = input<any>();
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
