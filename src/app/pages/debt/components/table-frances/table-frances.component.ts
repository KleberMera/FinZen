import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, input, SimpleChanges } from '@angular/core';
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
  totalMonths: number = 0;
  private readonly _methodService = inject(MethodService);
  
  ngOnInit() {
    // Calcula el total de meses para el indicador de progreso
    const amortizations = this.formData().get('amortizations')?.value || [];
    this.totalMonths = amortizations.length;
  }
  readonly formData = input.required<FormGroup>();


  ngOnChanges(changes: SimpleChanges) {
     if (this.formData().get('method')?.value === 'frances') {
      this.calculateAmortization();
      this._methodService.methodFrances(this.formData());
    } else {
      console.log('Posible implementation');
    }
 
  }

  calculateAmortization() {
    const monthlyRate = (this.formData().get('interest_rate')?.value / 100) / 12;
    const quota = this.formData().get('amount')?.value * (monthlyRate * Math.pow(1 + monthlyRate, this.formData().get('duration_months')?.value)) / 
                 (Math.pow(1 + monthlyRate, this.formData().get('duration_months')?.value) - 1);
    let outstanding = this.formData().get('amount')?.value;
    const amortizations = this.formData().get('amortizations') as FormArray;
    amortizations.clear();

    for (let month = 1; month <= this.formData().get('duration_months')?.value; month++) {
      const interest = outstanding * monthlyRate;
      const amortized = quota - interest;     
      outstanding = outstanding - amortized;
      const date = addMonth(format(this.formData().get('start_date')?.value, 'YYYY-MM-DD'), month - 1);
      amortizations.push(
        new FormGroup({
          number_months: new FormControl(month),
          date: new FormControl(format(date, 'YYYY-MM-DD')),
          quota: new FormControl(quota),
          interest: new FormControl(interest),
          amortized: new FormControl(amortized),
          outstanding: new FormControl(outstanding),
          status: new FormControl('pending')
        })
      );
    }
  }
}
