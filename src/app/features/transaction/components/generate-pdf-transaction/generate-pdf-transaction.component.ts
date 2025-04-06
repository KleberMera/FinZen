import { Component, input } from '@angular/core';
import { Transaction } from '@models/transaction';

@Component({
  selector: 'app-generate-pdf-transaction',
  imports: [],
  templateUrl: './generate-pdf-transaction.component.html',
  styleUrl: './generate-pdf-transaction.component.scss',
})
export class GeneratePdfTransactionComponent {
  readonly data = input.required<Transaction[]>();
  generatePdf() {
    console.log('PDF generated!');
    console.log(this.data());
    
  }
}
