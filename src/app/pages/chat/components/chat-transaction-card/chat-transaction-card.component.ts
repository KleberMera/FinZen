import { Component, inject, input, OnInit } from '@angular/core';
import { Transaction } from '@models/transaction';
import { TransactionService } from '../../../transaction/services/transaction.service';
import { toast } from 'ngx-sonner';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-transaction-card',
  imports: [],
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
}
