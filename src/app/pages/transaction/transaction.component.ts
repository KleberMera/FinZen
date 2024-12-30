import { Component, inject, OnInit, signal } from '@angular/core';
import { TransaccionesService } from '../../services/transacciones.service';

import { firstValueFrom } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormTransactionsComponent } from "./ui/form-transactions/form-transactions.component";
import { Transaction } from '@models/transaction';

@Component({
  selector: 'app-transacciones',
  imports: [FormTransactionsComponent, CurrencyPipe, DatePipe],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss',
})
export class TransactionComponent implements OnInit {
  private _transaccionesService = inject(TransaccionesService);
  public readonly transacciones = signal<Transaction[]>([]);
  readonly seletedUser = signal<number>(2);
  public readonly selectedCategory = signal<string>('');
  ngOnInit(): void {
   //this.getTransacciones();
  }
  /*async getTransacciones() {
    try {
      const res: any = await firstValueFrom(
        this._transaccionesService.getTranccionesbyUser(this.seletedUser())
      );
      this.transacciones.set(res);
      console.log(this.transacciones());
    } catch (error) {
      console.log(error);
    }
  }*/

  filterByCategory(event: Event) {
    const category = (event.target as HTMLSelectElement).value;
    this.selectedCategory.set(category);
  }

  filteredTransacciones() {
    return this.transacciones().filter(transaccion => 
      !this.selectedCategory() || 
      transaccion.name === this.selectedCategory()
    );
  }

  uniqueCategories(): string[] {
    return [...new Set(this.transacciones().map(t => t.name))];
  }
  
}
