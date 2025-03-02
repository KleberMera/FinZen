import { Component, EventEmitter, inject, output, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ImageService } from '../../services/image.service';
import { StorageService } from '@services/storage.service';
import { ProcessService } from '../../services/process.service';

@Component({
  selector: 'app-message-input',
  imports: [ReactiveFormsModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss'
})
export class MessageInputComponent {
  messageSent = output<void>();
  protected readonly _storageService = inject(StorageService);
  protected readonly seletedUser = signal<number>(this._storageService.getUserId());
  selectedImagePreview: string | null = null;

removeSelectedImage() {
  this.selectedImage.set(null);
  this.selectedImagePreview = null;
}
  private fb = inject(FormBuilder);
  private chatService = inject(ChatService);
  private imageService = inject(ImageService);
  private processService = inject(ProcessService);
  
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
          'Recibo enviado', 
          this.imageService.selectedImageUrl() ?? undefined
        );
        
       
        // Segunda simulación de análisis con animación infinita
        //this.chatService.addBotMessage('Analizando imagen...');
        
        try {
          // Iniciar la animación que continuará hasta que la detengamos
          const stopAnimation = this.chatService.startImageAnalysisAnimation();
          
          // Procesar la imagen
          const response = await this.processService.imageProcess(
            this.selectedImage()!, 
            this.seletedUser()
          ).toPromise();
          
          // Detener la animación una vez que tengamos la respuesta
          stopAnimation();
          
          // Mostrar la respuesta en una tarjeta
          this.chatService.addBotCardMessage(response?.transaction);
        } catch (error) {
          // Detener la animación y mostrar error
          this.chatService.analyzingImage.set(false);
          this.chatService.addBotMessage('Hubo un error al procesar la imagen. Inténtalo de nuevo.');
        }
        
        // Limpiar la imagen seleccionada
        this.imageService.removeSelectedImage();
        
      } else if (message?.trim()) {
        // Manejar mensaje de solo texto
        this.chatService.addUserMessage(message);
        
        // Mostrar mensaje de carga
        //this.chatService.addBotMessage('Procesando texto...');
        
        try {
          // Iniciar la animación que continuará hasta que la detengamos
          const stopAnimation = this.chatService.startTypingAnimation();
          
          // Procesar el texto
          const response = await this.processService.textProcess(
            message, 
            this.seletedUser()
          ).toPromise();
          
          // Detener la animación una vez que tengamos la respuesta
          stopAnimation();
          
          // Mostrar la respuesta en una tarjeta
          this.chatService.addBotCardMessage(response?.transaction);
        } catch (error) {
          // Detener la animación y mostrar error
          this.chatService.isTyping.set(false);
          this.chatService.addBotMessage('Hubo un error al procesar el texto. Inténtalo de nuevo.');
        }
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
