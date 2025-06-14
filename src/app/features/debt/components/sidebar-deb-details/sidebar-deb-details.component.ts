import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Amortization, UpdateAllStatusDto, UpdateStatusDto } from '@models/amortization';
import { DebtService } from '../../services/debt.service';
import { toast } from 'ngx-sonner';
import { format } from '@formkit/tempo';

@Component({
  selector: 'app-sidebar-deb-details',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './sidebar-deb-details.component.html',
  styleUrl: './sidebar-deb-details.component.scss',
})
export class SidebarDebDetailsComponent {
  closeUserSidebar = output<void>();
  readonly amortization = input.required<Amortization>(); // Recibe la transacción seleccionada
  readonly debtId = input.required<number>();
  private readonly _debtService = inject(DebtService);
  updateSuccess = output<void>();

  close() {
    this.closeUserSidebar.emit();
  }


    async onUpdateAmortization() {
    const updateDto: UpdateStatusDto = {
      id: this.amortization().id!, // Conversión segura
      status: 'Pagado',
      payment_date: format(new Date(), 'YYYY-MM-DD', 'es'),
    };

    console.log('updateDto', updateDto, this.debtId());

    this._debtService.updateDebtStatus(this.debtId(), updateDto).subscribe({
      next: (response) => {
        console.log('Amortizaciones actualizadas:', response);
        toast.success('Pagos actualizados correctamente');
        this.updateSuccess.emit(); // Emitir el evento de éxito
        this.close();
      },
    });
  }
}
