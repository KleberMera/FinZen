import { CommonModule, NgClass } from '@angular/common';
import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  readonly chatContainer = viewChild<ElementRef>('chatContainer');
  
  private fb = inject(FormBuilder);
  messageForm!: FormGroup;
  
  // Signals para los mensajes individuales
  private botMessagesSignal = signal<Message[]>([{
    id: 1,
    text: '¡Hola! ¿En qué puedo ayudarte hoy?',
    time: this.getCurrentTime(),
    type: 'bot',
    timestamp: Date.now()
  }]);
  
  private userMessagesSignal = signal<Message[]>([]);
  
  // Signal computed para combinar todos los mensajes ordenados cronológicamente
  allMessages = computed(() => {
    const combined = [
      ...this.botMessagesSignal(),
      ...this.userMessagesSignal()
    ];
    return combined.sort((a, b) => a.timestamp - b.timestamp);
  });
  
  isTyping = signal<boolean>(false);
  analyzingImage = signal<boolean>(false);
  selectedImage = signal<File | null>(null);
  selectedImageUrl = signal<string | null>(null);
  messageCounter = signal<number>(2);

  ngOnInit(): void {
    this.messageForm = this.fb.group({
      message: ['', []]
    });
  }

  sendMessage(): void {
    const message = this.messageForm.get('message')?.value;
    
    if (message?.trim() || this.selectedImage()) {
      const currentTimestamp = Date.now();
      
      // Añadir mensaje del usuario
      if (this.selectedImage()) {
        this.userMessagesSignal.update(messages => [
          ...messages, 
          {
            id: this.messageCounter(),
            text: message?.trim() ? message : `Recibo enviado`,
            time: this.getCurrentTime(),
            type: 'user',
            timestamp: currentTimestamp,
            imageUrl: this.selectedImageUrl() ?? undefined
          }
        ]);
        
        // Incrementar el contador de mensajes
        this.messageCounter.update(count => count + 1);
        
        // Mostrar indicador de análisis de imagen
        this.analyzingImage.set(true);
        
        // Simular análisis de imagen
        setTimeout(() => {
          this.analyzingImage.set(false);
          
          this.botMessagesSignal.update(messages => [
            ...messages,
            {
              id: this.messageCounter(),
              text: 'He recibido tu recibo. ¿Deseas generar un ticket para este gasto?',
              time: this.getCurrentTime(),
              type: 'bot',
              timestamp: Date.now()
            }
          ]);
          
          // Incrementar el contador de mensajes
          this.messageCounter.update(count => count + 1);
          
          this.scrollToBottom();
        }, 2500);
        
        this.removeSelectedImage();
        
      } else if (message?.trim()) {
        this.userMessagesSignal.update(messages => [
          ...messages, 
          {
            id: this.messageCounter(),
            text: message,
            time: this.getCurrentTime(),
            type: 'user',
            timestamp: currentTimestamp
          }
        ]);
        
        // Incrementar el contador de mensajes
        this.messageCounter.update(count => count + 1);
        
        // Mostrar indicador de escritura
        this.isTyping.set(true);
        
        // Simular respuesta del bot después de un tiempo
        setTimeout(() => {
          this.isTyping.set(false);
          
          this.botMessagesSignal.update(messages => [
            ...messages,
            {
              id: this.messageCounter(),
              text: 'Entendido. ¿Necesitas ayuda con algo más?',
              time: this.getCurrentTime(),
              type: 'bot',
              timestamp: Date.now()
            }
          ]);
          
          // Incrementar el contador de mensajes
          this.messageCounter.update(count => count + 1);
          
          this.scrollToBottom();
        }, 1500);
      }
      
      // Resetear el formulario
      this.messageForm.reset();
      this.scrollToBottom();
    }
  }

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

  getCurrentTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    
    const file = input.files[0];
    if (file && file.type.match(/image\/*/) && file.size <= 5242880) { // Max 5MB
      this.selectedImage.set(file);
      
      // Crear una URL para la vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageUrl.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Manejar error - archivo no válido o demasiado grande
      console.error('Archivo no válido o demasiado grande');
      // Se podría mostrar un mensaje de error al usuario
    }
  }

  removeSelectedImage(): void {
    this.selectedImage.set(null);
    this.selectedImageUrl.set(null);
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight > 120 ? 120 : textarea.scrollHeight) + 'px';
  }
}
