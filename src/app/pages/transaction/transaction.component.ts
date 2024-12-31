import { Component } from '@angular/core';
import { FormTransactionsComponent } from "./ui/form-transactions/form-transactions.component";
import { TableTransactionComponent } from "./ui/table-transaction/table-transaction.component";


@Component({
  selector: 'app-transacciones',
  imports: [FormTransactionsComponent, TableTransactionComponent],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss',
})
export class TransactionComponent  {

  
  
  
}
