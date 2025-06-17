import { TransactionReport } from './../../../../core/models/transaction';
import { Component, inject, input } from '@angular/core';
import generatePDF from './pdf';
import { format } from '@formkit/tempo';
import { PdfService } from '../../services/pdf.service';
import { toast } from 'ngx-sonner';
import { StorageService } from '../../../../shared/services/storage.service';

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
    // Get current date
    const currentDate = format(new Date(), 'YYYY-MM-DD', 'es');

    // Get input values
    const startDateValue = this.startDate();
    const endDateValue = this.endDate();
    const dateValue = this.date();

    // Validate data
    if (this.data().length === 0) {
      toast.error('No hay datos para generar el PDF');
      return;
    }

    // Validate dates
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
      // Validate that end date is not before start date
      const startDate = new Date(startDateValue);
      const endDate = new Date(endDateValue);
      
      if (endDate < startDate) {
        console.error('Error: La fecha final no puede ser menor que la fecha inicial');
        toast.error('Error: La fecha final no puede ser menor que la fecha inicial');
        return;
      }
    }

    // Validate single date vs range
    if (dateValue && (startDateValue || endDateValue)) {
      console.error('Error: No se pueden usar fecha única y rango de fechas al mismo tiempo');
      toast.error('Error: No se pueden usar fecha única y rango de fechas al mismo tiempo');
      return;
    }

    // Validaciones para rango de fechas
    if (startDateValue && !endDateValue) {
      console.error(
        'Error: Se requiere fecha final cuando se usa fecha inicial'
      );
      toast.error('Error: Se requiere fecha final cuando se usa fecha inicial');
      return;
    }
    if (!startDateValue && endDateValue) {
      console.error(
        'Error: Se requiere fecha inicial cuando se usa fecha final'
      );
      toast.error('Error: Se requiere fecha inicial cuando se usa fecha final');
      return;
    }
    if (startDateValue && endDateValue) {
      // Validar que la fecha final no sea menor que la inicial

      if (endDateValue < startDateValue) {
        console.error(
          'Error: La fecha final no puede ser menor que la fecha inicial'
        );
        toast.error(
          'Error: La fecha final no puede ser menor que la fecha inicial'
        );
        return;
      }
    }

    // Validación para fecha única
    if (dateValue && (startDateValue || endDateValue)) {
      console.log('FECHAS', startDateValue, endDateValue);
      console.log('FECHA UNICA', dateValue);
      console.error(
        'Error: No se pueden usar fecha única y rango de fechas al mismo tiempo'
      );
      toast.error(
        'Error: No se pueden usar fecha única y rango de fechas al mismo tiempo'
      );
      return;
    }

    if (this.data().length === 0) {
      toast.error('No hay datos para generar el PDF');
      return;
    }

    // Generate PDF based on selected case
    if (dateValue) {
      // Single date case
      generatePDF(
        this.data()!,
        currentDate,
        dateValue,
        undefined,
        undefined,
        this._storageService.getName()
      );
    } else if (!startDateValue && !endDateValue) {
      // No dates case
      generatePDF(
        this.data()!,
        currentDate,
        undefined,
        undefined,
        undefined,
        this._storageService.getName()
      );
    } else if (startDateValue && endDateValue) {
      // Date range case
      generatePDF(
        this.data()!,
        currentDate,
        undefined,
        startDateValue,
        endDateValue,
        this._storageService.getName()
      );
    } else {
      console.error('Error: Estado no válido de fechas');
      toast.error('Error: Estado no válido de fechas');
      return;
    }
  }
}
