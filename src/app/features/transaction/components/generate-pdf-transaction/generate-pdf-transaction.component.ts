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
  readonly date = input<string | undefined>();
  protected readonly _pdfService = inject(PdfService);
  protected readonly _storageService = inject(StorageService);
  generatePdf() {
    // Validar fechas según el modo seleccionado
    const startDateValue = this.startDate();
    const endDateValue = this.endDate();
    const dateValue = this.date();

    // Validaciones para rango de fechas
    if (startDateValue && !endDateValue) {
      console.error('Error: Se requiere fecha final cuando se usa fecha inicial');
      toast.error('Error: Se requiere fecha final cuando se usa fecha inicial');
      return;
    }
    if (!startDateValue && endDateValue) {
      console.error('Error: Se requiere fecha inicial cuando se usa fecha final');
      toast.error('Error: Se requiere fecha inicial cuando se usa fecha final');
      return;
    }
    if (startDateValue && endDateValue) {
      // Validar que la fecha final no sea menor que la inicial
      const startDate = new Date(startDateValue);
      const endDate = new Date(endDateValue);
      if (endDate < startDate) {
        console.error('Error: La fecha final no puede ser menor que la fecha inicial');
        toast.error('Error: La fecha final no puede ser menor que la fecha inicial');
        return;
      }
    }

    // Validación para fecha única
    if (dateValue && (startDateValue || endDateValue)) {
      console.error('Error: No se pueden usar fecha única y rango de fechas al mismo tiempo');
      toast.error('Error: No se pueden usar fecha única y rango de fechas al mismo tiempo');
      return;
    }

    // Imprimir las fechas
    if (startDateValue) {
      console.log('Fecha inicial:', format(startDateValue, 'YYYY-MM-DD', 'es'));
    }
    if (endDateValue) {
      console.log('Fecha final:', format(endDateValue, 'YYYY-MM-DD', 'es'));
    }
    if (dateValue) {
      console.log('Fecha única:', format(dateValue, 'YYYY-MM-DD', 'es'));
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
      console.log('Solo fecha inicial');
      
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
