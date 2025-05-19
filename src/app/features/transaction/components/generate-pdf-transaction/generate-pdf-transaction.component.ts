import { TransactionReport } from './../../../../core/models/transaction';
import { Component, inject, input } from '@angular/core';
import generatePDF from './pdf';
import { format } from '@formkit/tempo';
import { PdfService } from '../../services/pdf.service';
import { toast } from 'ngx-sonner';
import { StorageService } from '@services/storage.service';

@Component({
  selector: 'app-generate-pdf-transaction',
  imports: [],
  templateUrl: './generate-pdf-transaction.component.html',
  styleUrl: './generate-pdf-transaction.component.scss',
})
export class GeneratePdfTransactionComponent {
  readonly data = input.required<TransactionReport[]>();
  readonly startDate = input<string>();
  readonly endDate = input<string>();
  protected readonly _pdfService = inject(PdfService);
  protected readonly _storageService = inject(StorageService);
  generatePdf() {
    console.log(format(this.startDate()!, 'YYYY-MM-DD', 'es'));
    console.log(format(this.endDate()!, 'YYYY-MM-DD', 'es'));
    console.log(this.data());
    // if (this.data().length > 0) {
    if(this.data().length > 0){
      if (this.startDate() === this.endDate()) {
        generatePDF(
          this.data()!,
          format(new Date(), 'YYYY-MM-DD', 'es'),
          this._storageService.getName()
        );
      } else {
        generatePDF(
          this.data()!,
          format(new Date(), 'YYYY-MM-DD', 'es'),
          format(this.startDate()!, 'MMMM D, YYYY', 'es'),
          format(this.endDate()!, 'MMMM D, YYYY', 'es'),
          this._storageService.getName()
        );
      }
    }else{
      toast.error('No hay datos para generar el PDF');
    }

  }
}
