import { Component, inject, input, OnInit } from '@angular/core';
import { Transaction } from '@models/transaction';

import { toast } from 'ngx-sonner';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../../features/transaction/services/transaction.service';


@Component({
  selector: 'app-chat-transaction-card',
  imports: [CommonModule ],
  templateUrl: './chat-transaction-card.component.html',
  styleUrl: './chat-transaction-card.component.scss'
})
export class ChatTransactionCardComponent{
  readonly transaction = input.required<Transaction >();
  readonly idMessage = input.required<number>();
  protected readonly _chatService = inject(ChatService);
  protected readonly _transactionService = inject(TransactionService);
  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  }

  onDelete(){
    console.log('delete transaction');
    const id = this.transaction().id;
    if (id !== undefined) {
      this._transactionService.deleteTransaction(id).subscribe({
        next: (res) => {
          console.log('transaction deleted');
          toast.success(res.message);
          //Eliminar card 
          this._chatService.removeMessage(this.idMessage());

          
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }


  isExpanded = false;
  isDescriptionExpanded = false;
  
  // Función para alternar la expansión
  toggleExpandedDescription(): void {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }
  
  // Verifica si la descripción contiene una lista de elementos
  hasItemsList(description: string): boolean {
    if (!description) return false;
    return description.includes('\n-');
  }
  
  // Obtiene el encabezado de la descripción (texto antes de la lista)
  getDescriptionHeader(description: string): string {
    if (!description) return '';
    if (!this.hasItemsList(description)) return description;
    
    return description.split('\n-')[0].trim();
  }
  
  // Obtiene la lista de elementos de la descripción
  getItemsList(description: string): string[] {
    if (!description || !this.hasItemsList(description)) return [];
    
    const items = description.split('\n-');
    // Elimina el primer elemento (encabezado) y procesa los demás
    return items.slice(1).map(item => item.trim());
  }
  
  // Función para extraer los items de la lista
  getDescriptionItems(description: string): string[] {
    if (!description) return [];
    const parts = description.split('\n-');
    
    // Si solo hay una parte, no hay items de lista
    if (parts.length <= 1) return [];
    
    // Devolver todos los items (excepto el primer elemento que es el encabezado)
    return parts.slice(1).map(item => item.trim());
  }
}
