import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, effect, inject, input, signal, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { addMonth, format } from '@formkit/tempo';
import { MethodService } from '../../services/method.service';
import { CardTableComponent } from "../card-table/card-table.component";
import { Debt } from '@models/debt';

@Component({
  selector: 'table-frances',
  imports: [DatePipe, CurrencyPipe, ],
  templateUrl: './table-frances.component.html',
  styleUrl: './table-frances.component.scss'
})
export class TableFrancesComponent {
  readonly formData = input.required<FormGroup>();
 
  private readonly _methodService = inject(MethodService);
  
  
  constructor() {
    // Effect solo para el caso del formulario
    effect(() => {
      // Solo ejecutamos si tenemos formData
      if (this.formData()) {
        const method = this.formData()!.get('method')?.value;
        if (method === 'frances') {
          this._methodService.calculateFrenchAmortization(this.formData()!);
        } else {
          this._methodService.calculateGermanAmortization(this.formData()!);
        }
      }
    });
  }

}
