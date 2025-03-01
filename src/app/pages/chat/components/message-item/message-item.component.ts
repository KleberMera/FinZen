import { Component, input } from '@angular/core';
import { Message } from '@models/message';
import { ChatTransactionCardComponent } from "../chat-transaction-card/chat-transaction-card.component";

@Component({
  selector: 'app-message-item',
  imports: [ChatTransactionCardComponent],
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.scss'
})
export class MessageItemComponent {
  message = input.required<Message>();
}
