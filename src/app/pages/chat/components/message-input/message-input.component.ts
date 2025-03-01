import { Component, EventEmitter, inject, output, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-message-input',
  imports: [ReactiveFormsModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss'
})
export class MessageInputComponent {
  messageSent = output<void>();
  
  private fb = inject(FormBuilder);
  private chatService = inject(ChatService);
  private imageService = inject(ImageService);
  
  messageForm: FormGroup;
  
  constructor() {
    this.messageForm = this.fb.group({
      message: ['', []]
    });
  }
  
  get selectedImage() {
    return this.imageService.selectedImage;
  }
  
  async sendMessage(): Promise<void> {
    const message = this.messageForm.get('message')?.value;
    
    if (message?.trim() || this.selectedImage()) {
      if (this.selectedImage()) {
        // Manejar mensaje con imagen
        this.chatService.addUserMessage(
          message?.trim() ? message : 'Recibo enviado', 
          this.imageService.selectedImageUrl() ?? undefined
        );
        
        // Simular análisis de imagen
        await this.chatService.simulateImageAnalysis();
        
        // Agregar respuesta del bot
        this.chatService.addBotMessage('He recibido tu recibo. ¿Deseas generar un ticket para este gasto?');
        
        // Limpiar la imagen seleccionada
        this.imageService.removeSelectedImage();
        
      } else if (message?.trim()) {
        // Manejar mensaje de solo texto
        this.chatService.addUserMessage(message);
        
        // Simular respuesta del bot
        await this.chatService.simulateTyping();
        this.chatService.addBotMessage('Entendido. ¿Necesitas ayuda con algo más?');
      }
      
      // Limpiar formulario
      this.messageForm.reset();
      
      // Notificar que se envió un mensaje para hacer scroll
      this.messageSent.emit();
    }
  }
  
  onFileSelected(event: Event): void {
    this.imageService.handleFileSelection(event);
  }
  
  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight > 120 ? 120 : textarea.scrollHeight) + 'px';
  }
}
