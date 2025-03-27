import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Amortization, UpdateStatusDto } from '@models/amortization';
import { DebtService } from '../../services/debt.service';
import { toast } from 'ngx-sonner';

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

  async onUpdateAmortizations() {
    const updateDto: UpdateStatusDto = {
      ids: [this.amortization().id!], // Conversión segura
      status: 'Pagado',
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
