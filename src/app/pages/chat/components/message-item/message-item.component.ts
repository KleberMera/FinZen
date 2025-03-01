import { Component, input } from '@angular/core';
import { Message } from '@models/message';

@Component({
  selector: 'app-message-item',
  imports: [],
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.scss'
})
export class MessageItemComponent {
  message = input.required<Message>();
}
