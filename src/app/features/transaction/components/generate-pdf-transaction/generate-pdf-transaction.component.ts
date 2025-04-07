import { Component, input } from '@angular/core';
import { Transaction } from '@models/transaction';
import generatePDF from './pdf';

@Component({
  selector: 'app-generate-pdf-transaction',
  imports: [],
  templateUrl: './generate-pdf-transaction.component.html',
  styleUrl: './generate-pdf-transaction.component.scss',
})
export class GeneratePdfTransactionComponent {
  readonly data = input.required<Transaction[]>();
  generatePdf() {
    

    generatePDF(
      this.data()
        .filter((t) => t.category)
        .map((t) => ({
          ...t,
          category: t.category!,
        })),
      '2023-10-03'
    );
  }
}
