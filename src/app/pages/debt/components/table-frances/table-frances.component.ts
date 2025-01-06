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
  amount = input.required<number>();
  interestRate = input.required<number>();
  durationMonths = input.required<number>();
  startDate = input.required<string>();
  amortizationArray = input.required<FormArray>();

  ngOnChanges(changes: SimpleChanges) {
    if (this.amount() && this.interestRate() && this.durationMonths() && this.startDate()) {
      console.log(this.amount(), this.interestRate(), this.durationMonths(), this.startDate());
      
      this.calculateAmortization();
    }
  }

  private calculateAmortization() {
    const monthlyRate = (this.interestRate() / 100) / 12;
    const quota = this.amount() * (monthlyRate * Math.pow(1 + monthlyRate, this.durationMonths())) / 
                 (Math.pow(1 + monthlyRate, this.durationMonths()) - 1);
    console.log(monthlyRate, quota);
    
    let outstanding = this.amount();

    this.amortizationArray().clear();

    for (let month = 1; month <= this.durationMonths(); month++) {
      const interest = outstanding * monthlyRate;
      const amortized = quota - interest;
      outstanding -= amortized;
      const date = addMonth(format(this.startDate(), 'YYYY-MM-DD'), month - 1);

      this.amortizationArray().push(
        new FormGroup({
          number_months: new FormControl(month),
          date: new FormControl(format(date, 'YYYY-MM-DD')),
          quota: new FormControl(quota),
          interest: new FormControl(interest),
          amortized: new FormControl(amortized),
          outstanding: new FormControl(Math.max(0, outstanding)),
          status: new FormControl('pending')
        })
      );
    }
  }
}
