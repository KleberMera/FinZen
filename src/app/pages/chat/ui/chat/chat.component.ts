import { CommonModule, NgClass } from '@angular/common';
import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ChatHeaderComponent } from "../../components/chat-header/chat-header.component";
import { ChatMessagesComponent } from "../../components/chat-messages/chat-messages.component";
import { ImagePreviewComponent } from "../../components/image-preview/image-preview.component";
import { MessageInputComponent } from "../../components/message-input/message-input.component";
interface Message {
  id: number;
  text: string;
  time: string;
  type: 'user' | 'bot';
  timestamp: number;
  imageUrl?: string;
}

@Component({
  selector: 'app-chat',
  imports: [CommonModule, ReactiveFormsModule, ChatHeaderComponent, ChatMessagesComponent, ImagePreviewComponent, MessageInputComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  readonly chatContainer = viewChild<ElementRef>('chatContainer');
  
  constructor(protected chatService: ChatService) {}

  scrollToBottom(): void {
    setTimeout(() => {
      try {
        const container = this.chatContainer();
        if (container?.nativeElement) {
          container.nativeElement.scrollTop = container.nativeElement.scrollHeight;
        }
      } catch (err) {
        console.error('Error al hacer scroll:', err);
      }
    }, 100);
  }
}
