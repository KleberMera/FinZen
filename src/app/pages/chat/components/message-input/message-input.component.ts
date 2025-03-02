import { Component, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ImageService } from '../../services/image.service';
import { StorageService } from '@services/storage.service';
import { ProcessService } from '../../services/process.service';

@Component({
  selector: 'app-message-input',
  imports: [ReactiveFormsModule],
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
  selectedImagePreview = signal<string | null>(null);
  
  messageForm = signal<FormGroup>(
    new FormGroup({
      message: new FormControl('', []),
    })
  );

  removeSelectedImage() {
    this.selectedImage.set(null);
    this.selectedImagePreview.set(null);
  }

  get selectedImage() {
    return this.imageService.selectedImage;
  }

  async sendMessage() {
    const message = this.messageForm().get('message')?.value;
    if (this.selectedImage()) {
      this.resImage();
    } else {
      this.resText(message);
    }
    this.messageForm().reset();
    this.messageSent.emit();
  }

  onFileSelected(event: Event): void {
    this.imageService.handleFileSelection(event);
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height =
      (textarea.scrollHeight > 120 ? 120 : textarea.scrollHeight) + 'px';
  }

  resImage() {
    const stopAnimation = this.chatService.startImageAnalysisAnimation();
    this.chatService.addUserMessage(
      'Recibo enviado',
      this.imageService.selectedImageUrl() ?? undefined
    );

    this.processService
      .imageProcess(this.selectedImage()!, this.seletedUser())
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
        this.chatService.addBotCardMessage(res?.transaction);
      },
      error: (err) => {
        stopAnimation();
        this.chatService.addBotMessage(
          'Hubo un error al procesar el texto. Inténtalo de nuevo.'
        );
      },
    });
  }
}
