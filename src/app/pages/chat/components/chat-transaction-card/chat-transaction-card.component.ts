import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-transaction-card',
  imports: [],
  templateUrl: './chat-transaction-card.component.html',
  styleUrl: './chat-transaction-card.component.scss'
})
export class ChatTransactionCardComponent {
  @Input() transaction: any;

}
