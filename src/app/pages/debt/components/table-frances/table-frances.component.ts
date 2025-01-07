import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, input, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { addMonth, format } from '@formkit/tempo';

@Component({
  selector: 'table-frances',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './table-frances.component.html',
  styleUrl: './table-frances.component.scss'
})
export class TableFrancesComponent {
  

  formData = input.required<FormGroup>();

  ngOnChanges(changes: SimpleChanges) {
     if (this.formData().get('method')?.value === 'frances') {
      this.calculateAmortization();
    } else {
      console.log('Posible implementation');
      
    }
 
  }

  private calculateAmortization() {
    const monthlyRate = (this.formData().get('interest_rate')?.value / 100) / 12;
    const quota = this.formData().get('amount')?.value * (monthlyRate * Math.pow(1 + monthlyRate, this.formData().get('duration_months')?.value)) / 
                 (Math.pow(1 + monthlyRate, this.formData().get('duration_months')?.value) - 1);
    console.log(monthlyRate, quota);
    
    let outstanding = this.formData().get('amount')?.value;
    const amortizations = this.formData().get('amortizations') as FormArray;
    amortizations.clear();

    for (let month = 1; month <= this.formData().get('duration_months')?.value; month++) {
      const interest = outstanding * monthlyRate;
      const amortized = quota - interest;
      
      
      outstanding = outstanding - amortized;
      console.log('---------------');
      
      console.log(month, interest, amortized);
      const date = addMonth(format(this.formData().get('start_date')?.value, 'YYYY-MM-DD'), month - 1);

     console.log('-----------');
     
      console.log(month, date, interest, amortized, outstanding);
      
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
