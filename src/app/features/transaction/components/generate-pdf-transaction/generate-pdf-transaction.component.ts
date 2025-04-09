import { Component, input } from '@angular/core';
import { Transaction } from '@models/transaction';
import generatePDF from './pdf';
import { format } from '@formkit/tempo';

@Component({
  selector: 'app-generate-pdf-transaction',
  imports: [],
  templateUrl: './generate-pdf-transaction.component.html',
  styleUrl: './generate-pdf-transaction.component.scss',
})
export class GeneratePdfTransactionComponent {
  readonly data = input.required<Transaction[]>();
  generatePdf() {
    console.log(this.data());
    
    generatePDF(this.data(), format( new Date(), 'YYYY-MM-DD', 'es'));
  }
}
