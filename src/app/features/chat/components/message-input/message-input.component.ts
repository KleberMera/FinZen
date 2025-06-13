import { Component, HostListener, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ImageService } from '../../services/image.service';
import { StorageService } from '@services/storage.service';
import { ProcessService } from '../../services/process.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-input',
  imports: [ReactiveFormsModule, CommonModule],
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
      this.resImage();
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

  resImage() {
    console.log('Procesando imagen:', this.imageService.selectedImage());
    const stopAnimation = this.chatService.startImageAnalysisAnimation();
    this.chatService.addUserMessage(
      'Recibo enviado',
      this.imageService.selectedImageUrl() ?? undefined
    );

    this.processService
      .imageProcess(this.imageService.selectedImage()!, this.seletedUser())
      .subscribe({
        next: (res) => {
          stopAnimation();
          this.chatService.addBotCardMessage(res?.transaction);
          this.imageService.removeSelectedImage();
        },
        error: (err) => {
          stopAnimation();
          this.chatService.addBotMessage(
            'Hubo un error al procesar la imagen. Inténtalo de nuevo.'
          );
          this.imageService.removeSelectedImage();
        },
      });
  }

  resText(message: string) {
    this.chatService.addUserMessage(message);
    const stopAnimation = this.chatService.startTypingAnimation();
    this.processService.textProcess(message, this.seletedUser()).subscribe({
      next: (res) => {
        stopAnimation();
        if (res.isTransaction) {
          // Si es una transacción, mostrar la tarjeta
          this.chatService.addBotCardMessage(res?.transaction);
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
