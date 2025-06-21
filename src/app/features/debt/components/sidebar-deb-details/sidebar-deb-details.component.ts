import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Amortization, UpdateStatusDto } from '@models/amortization';
import { DebtService } from '../../services/debt.service';
import { toast } from 'ngx-sonner';
import { format } from '@formkit/tempo';
import { firstValueFrom } from 'rxjs';
import { BottomSheetContentComponent } from '../../../../shared/components/bottom-sheet';
import { TitleGradient } from '@models/styleClass';
import { da } from 'date-fns/locale';

@Component({
  selector: 'app-sidebar-deb-details',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, BottomSheetContentComponent],
  templateUrl: './sidebar-deb-details.component.html',
  styleUrl: './sidebar-deb-details.component.scss',
})
export class SidebarDebDetailsComponent {
  closeUserSidebar = output<void>();
  TitleGradient = TitleGradient;
  readonly amortization = input.required<Amortization>();
  readonly debtId = input.required<number>();
  private readonly _debtService = inject(DebtService);
  updateSuccess = output<void>();

  close() {
    this.closeUserSidebar.emit();
  }

  async onUpdateAmortization(cancel: boolean = false) {
    try {
      const updateDto: UpdateStatusDto = {
        id: this.amortization().id!, // Conversión segura
        status: cancel ? 'Pendiente' : 'Pagado',
        payment_date: cancel ? null : format(new Date(), 'YYYY-MM-DD', 'es'),
      };

      // await firstValueFrom(
      //   this._debtService.updateDebtStatus(this.debtId(), updateDto)
      // );

      // toast.success(
      //   cancel
      //     ? 'Pago cancelado correctamente'
      //     : 'Pago registrado correctamente'
      // );

      const debtPromise = firstValueFrom(this._debtService.updateDebtStatus(this.debtId(), updateDto));
      toast.promise(debtPromise,{
        loading: cancel ? 'Cancelando pago...' : 'Registrando pago...',
        success: (data) => {
            this.updateSuccess.emit();
          return cancel
            ? 'Pago cancelado correctamente'
            : 'Pago registrado correctamente';
        }
      })
    
    } catch (error) {
      console.error(error);
      toast.error('Error al registrar el pago');
    }
  }
}
