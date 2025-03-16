import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, output, input, LOCALE_ID, inject } from '@angular/core';
import { Transaction } from '@models/transaction';
import { TransactionService } from '../../services/transaction.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-detail-transaction',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './detail-transaction.component.html',
  styleUrl: './detail-transaction.component.scss',
  
})
export class DetailTransactionComponent {
  closeUserSidebar = output<void>(); // Evento para cerrar el sidebar
  deleteSuccess = output<void>();    // Nuevo evento para notificar eliminación exitosa
  readonly transaction = input.required<Transaction>(); // Recibe la transacción seleccionada
  private readonly _transactionService = inject(TransactionService)

  // Método para cerrar el sidebar
  close(): void {
    console.log('Emitido');
    this.closeUserSidebar.emit(); // Emite el evento para cerrar el sidebar
  }

  hasItemsList(description: string): boolean {
    return description.includes('\n-');
  }

  getDescriptionHeader(description: string): string {
    if (!this.hasItemsList(description)) return description;
    return description.split('\n-')[0].trim();
  }

  getItemsList(description: string): string[] {
    if (!this.hasItemsList(description)) return [];
    
    const items = description.split('\n-');
    // Elimina el primer elemento (encabezado) y procesa los demás
    return items.slice(1).map(item => item.trim());
  }


  edit(): void {
    // Implementar lógica para editar
    console.log('Editar transacción:', this.transaction());
    
  }

  /**
   * Elimina la transacción
   */
  delete(): void {
    // Implementar lógica para eliminar
    console.log('Eliminar transacción:', this.transaction());
    console.log('delete transaction');
        const id = this.transaction().id;
        if (id !== undefined) {
          this._transactionService.deleteTransaction(id).subscribe({
            next: (res) => {
              console.log('transaction deleted');
              toast.success(res.message);
              //Eliminar card 
              //this._chatService.removeMessage(this.idMessage());
              this.close();
              this.deleteSuccess.emit();
              
            },
            error: (error) => {
              console.error(error);
            }
          });
        }
  }
}
