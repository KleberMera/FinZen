import { computed, Injectable, signal } from '@angular/core';
import { apiResponse } from '@models/apiResponse';
import { Message } from '@models/message';
import { Transaction } from '@models/transaction';

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

  // Método para añadir un mensaje de carga
  addLoadingMessage(text: string): void {
    const id = this.messageCounter();
    this.botMessages.update(messages => [
      ...messages,
      {
        id,
        text,
        time: this.getCurrentTime(),
        type: 'loading',
        timestamp: Date.now()
      }
    ]);
    this.messageCounter.update(count => count + 1);
  }

  // Método para añadir una tarjeta con la respuesta del servidor
  addBotCardMessage(transaction: any): void {
    const id = this.messageCounter();
    this.botMessages.update(messages => [
      ...messages,
      {
        id,
        text: '', // El texto se manejará en el componente de la tarjeta
        time: this.getCurrentTime(),
        type: 'bot-card',
        timestamp: Date.now(),
        transaction // Pasamos la transacción como parte del mensaje
      }
    ]);
    this.messageCounter.update(count => count + 1);
  }

  // Método mejorado para mostrar animación de typing
  // Acepta un parámetro opcional para establecer una duración específica
  // Si se pasa 0 o null, utiliza la duración por defecto
  simulateTyping(duration: number = 1500): Promise<void> {
    this.isTyping.set(true);
    
    // Si la duración es 0, usamos el valor por defecto
    const animationDuration = duration || 1500;
    
    return new Promise(resolve => {
      setTimeout(() => {
        this.isTyping.set(false);
        resolve();
      }, animationDuration);
    });
  }

  // Método mejorado para mostrar animación de análisis de imagen
  // Acepta un parámetro opcional para establecer una duración específica
  // Si se pasa 0 o null, utiliza la duración por defecto
  simulateImageAnalysis(duration: number = 2500): Promise<void> {
    this.analyzingImage.set(true);
    
    // Si la duración es 0, usamos el valor por defecto
    const animationDuration = duration || 2500;
    
    return new Promise(resolve => {
      setTimeout(() => {
        this.analyzingImage.set(false);
        resolve();
      }, animationDuration);
    });
  }

  private getCurrentTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
