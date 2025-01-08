import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, input, signal, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { addMonth, format } from '@formkit/tempo';
import { MethodService } from '../../services/method.service';

@Component({
  selector: 'table-frances',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './table-frances.component.html',
  styleUrl: './table-frances.component.scss'
})
export class TableFrancesComponent {
  totalMonths = signal<number>(0);
  private readonly _methodService = inject(MethodService);
  
  ngOnInit() {
    // Calcula el total de meses para el indicador de progreso
    const amortizations = this.formData().get('amortizations')?.value || [];
    this.totalMonths.set(amortizations.length);
  }
  readonly formData = input.required<FormGroup>();


  ngOnChanges(changes: SimpleChanges) {
     if (this.formData().get('method')?.value === 'frances') {
      
      this._methodService.calculateFrenchAmortization(this.formData());
    } else {
      console.log('Posible implementation');
    }
 
  }


}
