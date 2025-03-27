import { Component, EventEmitter, inject, output, Output } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { MessageItemComponent } from "../message-item/message-item.component";
import { TypingIndicatorComponent } from "../typing-indicator/typing-indicator.component";
import { AnalysisIndicatorComponent } from "../analysis-indicator/analysis-indicator.component";

@Component({
  selector: 'app-chat-messages',
  imports: [MessageItemComponent, TypingIndicatorComponent, AnalysisIndicatorComponent],
  templateUrl: './chat-messages.component.html',
  styleUrl: './chat-messages.component.scss'
})
export class ChatMessagesComponent {
  public readonly scrollRequest = output<void>();
  
  public readonly chatService = inject(ChatService);
}
