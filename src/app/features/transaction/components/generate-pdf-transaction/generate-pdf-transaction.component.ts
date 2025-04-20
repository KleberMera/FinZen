import { Component, inject, input } from '@angular/core';
import { Transaction } from '@models/transaction';
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
  readonly data = input.required<Transaction[]>();
  protected readonly _pdfService = inject(PdfService);
  generatePdf() {
    console.log(this.data());

    this._pdfService.generatePDF(this.data()).subscribe({
      next: (response) => {
        // Crear un objeto URL para el blob
        const blob = response.body;
        const url = window.URL.createObjectURL(blob!);

        // Crear un enlace temporal y simular clic para descargar
        const a = document.createElement('a');
        window.open(url, '_blank');

        // Limpiar
        window.URL.revokeObjectURL(url);
        //document.body.removeChild(a);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
