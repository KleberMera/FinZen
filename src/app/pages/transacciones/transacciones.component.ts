import { Component, inject, OnInit, signal } from '@angular/core';
import { TransaccionesService } from '../../services/transacciones.service';
import { Transacciones } from '../../core/models/transacciones';
import { firstValueFrom } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormTransactionsComponent } from "./components/form-transactions/form-transactions.component";

@Component({
  selector: 'app-transacciones',
  imports: [FormTransactionsComponent, CurrencyPipe, DatePipe],
  templateUrl: './transacciones.component.html',
  styleUrl: './transacciones.component.scss',
})
export class TransaccionesComponent implements OnInit {
  private _transaccionesService = inject(TransaccionesService);
  public readonly transacciones = signal<Transacciones[]>([]);
  readonly seletedUser = signal<number>(2);
  public readonly selectedCategory = signal<string>('');
  ngOnInit(): void {
    this.getTransacciones();
  }
  async getTransacciones() {
    try {
      const res: any = await firstValueFrom(
        this._transaccionesService.getTranccionesbyUser(this.seletedUser())
      );
      this.transacciones.set(res);
      console.log(this.transacciones());
    } catch (error) {
      console.log(error);
    }
  }

  filterByCategory(event: Event) {
    const category = (event.target as HTMLSelectElement).value;
    this.selectedCategory.set(category);
  }

  filteredTransacciones() {
    return this.transacciones().filter(transaccion => 
      !this.selectedCategory() || 
      transaccion.categoria_nombre === this.selectedCategory()
    );
  }

  uniqueCategories(): string[] {
    return [...new Set(this.transacciones().map(t => t.categoria_nombre))];
  }
  
}
