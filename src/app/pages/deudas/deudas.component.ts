import { Component, inject, signal } from '@angular/core';
import { Deudas } from '../../core/models/deudas';
import { FormControl, FormGroup } from '@angular/forms';
import { DeudasService } from '../../services/deudas.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-deudas',
  imports: [],
  templateUrl: './deudas.component.html',
  styleUrl: './deudas.component.scss',
})
export class DeudasComponent {
  seletedUser = signal<number>(2);
  public _deudaService = inject(DeudasService);
  public form = signal<FormGroup>(
    new FormGroup({
      id: new FormControl(0),
      usuario_id: new FormControl(this.seletedUser()),
      acreedor: new FormControl(''),
      monto_total: new FormControl(''),
      saldo_pendiente: new FormControl(''),
      tasa_interes: new FormControl(''),
      fecha_inicio: new FormControl(''),
      fecha_limite: new FormControl(''),
      estrategia_id: new FormControl(''),
      estado: new FormControl(''),
      tipo_deuda: new FormControl(''),
    })
  );

  async saveDeuda() {
    if (this.form().valid) {
      try {
        const payload = this.form().value;
        const res = await firstValueFrom(this._deudaService.createDeuda(payload));
        if (res) {
          console.log(res);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}
