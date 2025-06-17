import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Amortization, UpdateStatusDto } from '@models/amortization';
import { DebtService } from '../../services/debt.service';
import { toast } from 'ngx-sonner';
import { format } from '@formkit/tempo';
import { firstValueFrom } from 'rxjs';
import { BottomSheetContentComponent } from '../../../../shared/components/bottom-sheet';

@Component({
  selector: 'app-sidebar-deb-details',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, BottomSheetContentComponent],
  templateUrl: './sidebar-deb-details.component.html',
  styleUrl: './sidebar-deb-details.component.scss',
})
export class SidebarDebDetailsComponent {
  closeUserSidebar = output<void>();
  readonly amortization = input.required<Amortization>();
  readonly debtId = input.required<number>();
  private readonly _debtService = inject(DebtService);
  updateSuccess = output<void>();

  close() {
    this.closeUserSidebar.emit();
  }

  async onUpdateAmortization() {
    try {
      const updateDto: UpdateStatusDto = {
        id: this.amortization().id!, // Conversión segura
        status: 'Pagado',
        payment_date: format(new Date(), 'YYYY-MM-DD', 'es'),
      };

      await firstValueFrom(
        this._debtService.updateDebtStatus(this.debtId(), updateDto)
      );

      toast.success('Pago registrado correctamente');
      this.updateSuccess.emit();
    } catch (error) {
      console.error(error);
      toast.error('Error al registrar el pago');
    }
  }
}
