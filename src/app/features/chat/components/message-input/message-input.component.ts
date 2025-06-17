import { Component, HostListener, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ImageService } from '../../services/image.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { ProcessService } from '../../services/process.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-input',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})

export class MessageInputComponent {
  protected readonly _storageService = inject(StorageService);
  protected readonly chatService = inject(ChatService);
  protected readonly imageService = inject(ImageService);
  protected readonly processService = inject(ProcessService);
  protected readonly seletedUser = signal<number>(this._storageService.getUserId());

  messageSent = output<void>();
  showMediaOptions = signal<boolean>(false);
  multipleMode = signal<boolean>(true); // Por defecto activado para detectar múltiples transacciones
  
  messageForm = signal<FormGroup>(
    new FormGroup({
      message: new FormControl('', []),
    })
  );

  // Función para mostrar/ocultar opciones de media
  toggleMediaOptions() {
    this.showMediaOptions.set(!this.showMediaOptions());
  }

  // Función para cerrar las opciones de media
  closeMediaOptions() {
    this.showMediaOptions.set(false);
  }

  // Detectar clicks fuera del menú para cerrarlo
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Verifica si el clic fue fuera del menú y sus botones
    if (this.showMediaOptions() && !(event.target as HTMLElement).closest('.media-options')) {
      this.closeMediaOptions();
    }
  }

  removeSelectedImage() {
    this.imageService.removeSelectedImage();
  }

  get selectedImage() {
    return this.imageService.selectedImage;
  }

  selectedImagePreview() {
    return this.imageService.selectedImageUrl();
  }

  async sendMessage() {
    const message = this.messageForm().get('message')?.value;
    
    if (this.imageService.selectedImage()) {
      // Si hay una imagen seleccionada, enviar la imagen con el texto opcional del input
      this.resImage(message);
    } else if (message && message.trim()) {
      this.resText(message);
    }
    
    this.messageForm().reset();
    this.messageSent.emit();
  }

  onFileSelected(event: Event): void {
    console.log('Archivo seleccionado:', event);
    this.imageService.handleFileSelection(event);
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height =
      (textarea.scrollHeight > 120 ? 120 : textarea.scrollHeight) + 'px';
  }

  resImage(additionalText: string = '') {
    console.log('Procesando imagen:', this.imageService.selectedImage());
    const stopAnimation = this.chatService.startImageAnalysisAnimation();
    
    // Si hay texto adicional, mostrar un mensaje más descriptivo
    const userMessage = additionalText ? 
      `Recibo enviado${additionalText ? ': ' + additionalText : ''}` : 
      'Recibo enviado';
    
    this.chatService.addUserMessage(
      userMessage,
      this.imageService.selectedImageUrl() ?? undefined
    );

    this.processService
      .imageProcess(
        this.imageService.selectedImage()!, 
        this.seletedUser(), 
        additionalText, 
        this.multipleMode()
      )
      .subscribe({
        next: (res: any) => {
          console.log('res', res);
          
          stopAnimation();
           if(res.status === 200){
            if (res.isMultiple && Array.isArray(res.transactions)) {
              // Mostrar múltiples transacciones para confirmación
              this.chatService.addMultipleTransactionsMessage(
                res.transactions,
                res.receiptImageS3Key
              );
            } else {
              this.chatService.addBotCardMessage(res.transaction);
              // Mostrar una sola transacción
            //  if(res.message){
            //   this.chatService.addBotMessage('😊 Por favor asegúrate de subir una imagen clara y legible del recibo');
             
            //  } else {
            //   
            //  }
            }
           } else {
            this.chatService.addBotMessage('😊 Por favor asegúrate de subir una imagen clara y legible del recibo');
           }
          
          // Verificar si la respuesta contiene múltiples transacciones
         
          
          this.imageService.removeSelectedImage();
        },
        error: (err) => {
          stopAnimation();
          this.chatService.addBotMessage('😊 Por favor asegúrate de subir una imagen clara y legible del recibo');
             
          this.imageService.removeSelectedImage();
        },
      });
  }

  resText(message: string) {
    this.chatService.addUserMessage(message);
    const stopAnimation = this.chatService.startTypingAnimation();
    
    this.processService.textProcess(message, this.seletedUser(), this.multipleMode()).subscribe({
      next: (res: any) => {
        stopAnimation();
        
        if (res.isTransaction) {
          // Verificar si la respuesta contiene múltiples transacciones
          if (res.isMultiple && Array.isArray(res.transactions)) {
            // Mostrar múltiples transacciones para confirmación
            this.chatService.addMultipleTransactionsMessage(res.transactions);
          } else {
            // Mostrar una sola transacción
            this.chatService.addBotCardMessage(res?.transaction);
          }
        } else {
          // Si es una respuesta conversacional, mostrar el mensaje
          this.chatService.addBotMessage(res.message);
        }
      },
      error: (err) => {
        stopAnimation();
        this.chatService.addBotMessage(
          'Hubo un error al procesar el texto. Inténtalo de nuevo.'
        );
      },
    });
  }
  
  resetConversation() {
    // Reiniciar la conversación en el frontend
    this.chatService.resetChat();
    
    // Reiniciar la conversación en el backend
    this.processService.resetConversation(this.seletedUser()).subscribe({
      next: (res) => {
        console.log('Conversación reiniciada en el backend:', res);
      },
      error: (err) => {
        console.error('Error al reiniciar la conversación:', err);
      }
    });
    
    this.messageSent.emit();
  }
}
