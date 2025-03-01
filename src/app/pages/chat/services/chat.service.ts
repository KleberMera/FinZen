import { computed, Injectable, signal } from '@angular/core';
import { Message } from '@models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private botMessages = signal<Message[]>([{
    id: 1,
    text: '¡Hola! ¿En qué puedo ayudarte hoy?',
    time: this.getCurrentTime(),
    type: 'bot',
    timestamp: Date.now()
  }]);
  
  private userMessages = signal<Message[]>([]);
  
  // Signal para el contador de mensajes
  private messageCounter = signal<number>(2);
  
  // Signals para estados de UI
  isTyping = signal<boolean>(false);
  analyzingImage = signal<boolean>(false);
  
  // Signal computed para combinar todos los mensajes ordenados
  allMessages = computed(() => {
    const combined = [
      ...this.botMessages(),
      ...this.userMessages()
    ];
    return combined.sort((a, b) => a.timestamp - b.timestamp);
  });

  addUserMessage(text: string, imageUrl?: string): void {
    const id = this.messageCounter();
    this.userMessages.update(messages => [
      ...messages, 
      {
        id,
        text,
        time: this.getCurrentTime(),
        type: 'user',
        timestamp: Date.now(),
        imageUrl
      }
    ]);
    this.messageCounter.update(count => count + 1);
  }

  addBotMessage(text: string): void {
    const id = this.messageCounter();
    this.botMessages.update(messages => [
      ...messages,
      {
        id,
        text,
        time: this.getCurrentTime(),
        type: 'bot',
        timestamp: Date.now()
      }
    ]);
    this.messageCounter.update(count => count + 1);
  }

  simulateTyping(duration: number = 1500): Promise<void> {
    this.isTyping.set(true);
    return new Promise(resolve => {
      setTimeout(() => {
        this.isTyping.set(false);
        resolve();
      }, duration);
    });
  }

  simulateImageAnalysis(duration: number = 2500): Promise<void> {
    this.analyzingImage.set(true);
    return new Promise(resolve => {
      setTimeout(() => {
        this.analyzingImage.set(false);
        resolve();
      }, duration);
    });
  }

  private getCurrentTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
