import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessService } from '../../services/process.service';
import { ChatService } from '../../services/chat.service';
import { StorageService } from '@services/storage.service';
import { Transaction, TransactionMultiple } from '@models/transaction';

@Component({
  selector: 'app-chat-multiple-transactions-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-multiple-transactions-card.component.html',
  styleUrl: './chat-multiple-transactions-card.component.scss'
})
export class ChatMultipleTransactionsCardComponent implements OnInit {
  @Input() set transactionsData(value: Transaction[]) {
    if (value && value.length > 0) {
      this.transactions.set(value);
    }
  }
  
  @Input() idMessage: number = null as any;
  @Input() receiptImageS3Key: string = '';
  
  transactions = signal<TransactionMultiple[]>([]);
  expandedDescriptions: boolean[] = [];
  
  private readonly processService = inject(ProcessService);
  private readonly chatService = inject(ChatService);
  private readonly storageService = inject(StorageService);
  
  ngOnInit(): void {
    // Inicializar el array de descripciones expandidas
    console.log('Transacciones:', this.transactions());
    
    this.expandedDescriptions = new Array(this.transactions().length).fill(false);
  }
  
  toggleDescription(index: number): void {
    this.expandedDescriptions[index] = !this.expandedDescriptions[index];
  }
  
  editTransaction(index: number): void {
    // Implementar la edición de transacción
    console.log('Editar transacción:', this.transactions()[index]);
    // Por ahora, esta funcionalidad no está implementada
    // Se podría abrir un modal o navegar a una página de edición
  }
  
  confirmTransaction(index: number): void {
    const transaction = this.transactions()[index];
    
    // Confirmar una sola transacción
    this.processService.confirmTransactions(
      [transaction],
      this.storageService.getUserId(),
      this.receiptImageS3Key
    ).subscribe({
      next: (res: any) => {
        if (res && res.transactions && res.transactions.length > 0) {
          // Mostrar la transacción confirmada
          this.chatService.addBotCardMessage(res.transactions[0]);
          
          // Eliminar la transacción del array
          const updatedTransactions = [...this.transactions()];
          updatedTransactions.splice(index, 1);
          this.transactions.set(updatedTransactions);
          
          // Si no quedan más transacciones, eliminar el mensaje de múltiples transacciones
          if (updatedTransactions.length === 0 && this.idMessage) {
            this.chatService.removeMessage(this.idMessage );
          }
        }
      },
      error: (err) => {
        console.error('Error al confirmar la transacción:', err);
        this.chatService.addBotMessage('Hubo un error al confirmar la transacción. Inténtalo de nuevo.');
      }
    });
  }
  
  removeTransaction(index: number): void {
    // Eliminar la transacción del array
    const updatedTransactions = [...this.transactions()];
    updatedTransactions.splice(index, 1);
    this.transactions.set(updatedTransactions);
    
    // Actualizar el array de descripciones expandidas
    this.expandedDescriptions.splice(index, 1);
    
    // Si no quedan más transacciones, eliminar el mensaje de múltiples transacciones
    if (updatedTransactions.length === 0 && this.idMessage) {
      this.chatService.removeMessage(this.idMessage);
    }
  }
  
  confirmAllTransactions(): void {
    // Confirmar todas las transacciones
    this.processService.confirmTransactions(
      this.transactions(),
      this.storageService.getUserId(),
      this.receiptImageS3Key
    ).subscribe({
      next: (res : any) => {
        if (res && res.transactions && res.transactions.length > 0) {
          // Mostrar un mensaje de confirmación
          this.chatService.addBotMessage(`Se han confirmado ${res.transactions.length} transacciones exitosamente.`);
          
          // Mostrar cada transacción confirmada
          for (const transaction of res.transactions) {
            this.chatService.addBotCardMessage(transaction);
          }
          
          // Eliminar el mensaje de múltiples transacciones
          if (this.idMessage) {
            this.chatService.removeMessage(this.idMessage);
          }
        }
      },
      error: (err) => {
        console.error('Error al confirmar las transacciones:', err);
        this.chatService.addBotMessage('Hubo un error al confirmar las transacciones. Inténtalo de nuevo.');
      }
    });
  }
}