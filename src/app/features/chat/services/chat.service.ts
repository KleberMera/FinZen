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
    text: '¡Hola! 👋 Soy tu asistente para registrar transacciones.\n\nPuedes:\n- Enviarme una foto de tu recibo/factura 📸\n- Describir tu transacción en texto 💬\n\nEstoy aquí para ayudarte a registrar tus ingresos y gastos de forma fácil.',
   
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
  // Ahora devuelve una función para detener la animación cuando sea necesario
  startTypingAnimation(): () => void {
    this.isTyping.set(true);
    return () => this.isTyping.set(false);
  }

  // Método mejorado para mostrar animación de análisis de imagen
  // Ahora devuelve una función para detener la animación cuando sea necesario
  startImageAnalysisAnimation(): () => void {
    this.analyzingImage.set(true);
    return () => this.analyzingImage.set(false);
  }

  // Para compatibilidad con código existente, mantenemos estos métodos
  // pero internamente usan los nuevos métodos
  simulateTyping(duration: number = 1500): Promise<void> {
    const stopAnimation = this.startTypingAnimation();
    
    return new Promise(resolve => {
      setTimeout(() => {
        stopAnimation();
        resolve();
      }, duration);
    });
  }

  simulateImageAnalysis(duration: number = 2500): Promise<void> {
    const stopAnimation = this.startImageAnalysisAnimation();
    
    return new Promise(resolve => {
      setTimeout(() => {
        stopAnimation();
        resolve();
      }, duration);
    });
  }

  private getCurrentTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  removeMessage(id: number): void {
    const idUser = id - 1;
    this.botMessages.update(messages => messages.filter(m => m.id !== id));
    this.userMessages.update(messages => messages.filter(m => m.id !== idUser));
  }
}
