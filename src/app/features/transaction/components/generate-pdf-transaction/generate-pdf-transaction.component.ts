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
  readonly startDate = input<string | undefined>();
  readonly endDate = input<string | undefined>();
  protected readonly _pdfService = inject(PdfService);
  protected readonly _storageService = inject(StorageService);
  generatePdf() {
    // Obtener las fechas
    const startDateValue = this.startDate();
    const endDateValue = this.endDate();
    
    // Imprimir solo las fechas que existen
    if (startDateValue) {
      console.log('Fecha inicial:', format(startDateValue, 'YYYY-MM-DD', 'es'));
    }
    if (endDateValue) {
      console.log('Fecha final:', format(endDateValue, 'YYYY-MM-DD', 'es'));
    }
    console.log('Datos:', this.data());

    if (this.data().length === 0) {
      toast.error('No hay datos para generar el PDF');
      return;
    }

    // Si no hay fechas, generar PDF sin fechas
    if (!startDateValue && !endDateValue) {
      generatePDF(
        this.data()!,
        format(new Date(), 'YYYY-MM-DD', 'es'),
        this._storageService.getName()
      );
      return;
    }

    // Si solo hay fecha inicial
    if (!endDateValue) {
      generatePDF(
        this.data()!,
        format(new Date(), 'YYYY-MM-DD', 'es'),
        format(new Date(startDateValue!), 'MMMM D, YYYY', 'es'),
        this._storageService.getName()
      );
      return;
    }

    // Si solo hay fecha final
    if (!startDateValue) {
      generatePDF(
        this.data()!,
        format(new Date(), 'YYYY-MM-DD', 'es'),
        this._storageService.getName(),
        format(new Date(endDateValue!), 'MMMM D, YYYY', 'es')
      );
      return;
    }

    const startDate = new Date(this.startDate()!);
    const endDate = new Date(this.endDate()!);

    if (startDate >= endDate) {
      toast.error('La fecha inicial debe ser anterior a la fecha final');
      return;
    }

    // Si las fechas son diferentes
    generatePDF(
      this.data()!,
      format(new Date(), 'YYYY-MM-DD', 'es'),
      format(startDate, 'MMMM D, YYYY', 'es'),
      format(endDate, 'MMMM D, YYYY', 'es'),
      this._storageService.getName()
    );
  }
}
