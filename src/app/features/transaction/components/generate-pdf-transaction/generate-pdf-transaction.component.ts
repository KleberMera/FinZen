import { TransactionReport } from './../../../../core/models/transaction';
import { Component, inject, input } from '@angular/core';
import generatePDF from './pdf';
import { format } from '@formkit/tempo';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-generate-pdf-transaction',
  imports: [],
  templateUrl: './generate-pdf-transaction.component.html',
  styleUrl: './generate-pdf-transaction.component.scss',
})
export class GeneratePdfTransactionComponent {
  readonly data = input.required<TransactionReport[]>();
  protected readonly _pdfService = inject(PdfService);
  generatePdf() {
    console.log(this.data());

    generatePDF(this.data()!, format(new Date(), 'YYYY-MM-DD', 'es'));
  }
}
