import { Component, inject, OnInit, signal } from '@angular/core';
import { TransaccionesService } from '../../../../services/transacciones.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { Categorias } from '../../../categorias/core/models/categorias.models';
import { CategoriasService } from '../../../../services/categorias.service';


@Component({
  selector: 'form-transactions',
  imports: [ReactiveFormsModule],
  templateUrl: './form-transactions.component.html',
  styleUrl: './form-transactions.component.scss',
})
export class FormTransactionsComponent implements OnInit {
  private readonly _transaccionesService = inject(TransaccionesService);
  private readonly _categoriasService = inject(CategoriasService);
  private toast = inject(ToastService);
  seletedUser = signal<number>(2);
  public readonly selectedCategory = signal<string>('');
  readonly categorias = signal<Categorias[]>([]);

  public readonly form = signal<FormGroup>(
    new FormGroup({
      id: new FormControl(0),
      usuario_id: new FormControl(this.seletedUser()),
      categoria_id: new FormControl( 0, [Validators.required, Validators.min(1)]),
      monto: new FormControl(0, [Validators.required]),
      fecha: new FormControl(''),
      descripcion: new FormControl(''),
      tipo: new FormControl(''),
    })
  );
 ngOnInit(): void {
   this.getCategorias();
 }

  async getCategorias() {
    try {
      const res: Categorias[] = await firstValueFrom(this._categoriasService.getCategorias(this.seletedUser()));
      this.categorias.set(res);
      console.log(this.categorias());
    } catch (error) {
      console.log(error);
    }
  }

  //Guardar transacciones
  async saveTransaccion() {
    if (this.form().valid) {
      const payload = this.form().value;
      const res = await firstValueFrom(this._transaccionesService.createTransaccion(payload)) as any;
      if (res) {
        this.toast.show({ message: `Transacción  creada exitosamente`, type: 'success' },
          { position: 'top-right', duration: 3000 }
        );
        this.form().reset();
      }
    }
  }
}
