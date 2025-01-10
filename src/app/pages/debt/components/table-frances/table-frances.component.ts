import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, input, signal, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { addMonth, format } from '@formkit/tempo';
import { MethodService } from '../../services/method.service';
import { CardTableComponent } from "../card-table/card-table.component";

@Component({
  selector: 'table-frances',
  imports: [DatePipe, CurrencyPipe, CardTableComponent],
  templateUrl: './table-frances.component.html',
  styleUrl: './table-frances.component.scss'
})
export class TableFrancesComponent {
  readonly formData = input.required<FormGroup>();
 
  private readonly _methodService = inject(MethodService);
  
  
  ngOnChanges(changes: SimpleChanges) {
     if (this.formData().get('method')?.value === 'frances') {  
      this._methodService.calculateFrenchAmortization(this.formData());
    } else {
      this._methodService.calculateGermanAmortization(this.formData());
    }
 
  }

}
