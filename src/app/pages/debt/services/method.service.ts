import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { addMonth, format } from '@formkit/tempo';

@Injectable({
  providedIn: 'root'
})
export class MethodService {


  calculateFrenchAmortization(data : FormGroup ){
    const monthlyRate = (data.get('interest_rate')?.value / 100) / 12;
    const quota = data.get('amount')?.value * (monthlyRate * Math.pow(1 + monthlyRate, data.get('duration_months')?.value)) / 
                 (Math.pow(1 + monthlyRate, data.get('duration_months')?.value) - 1);
    let outstanding = data.get('amount')?.value;
    const amortizations = data.get('amortizations') as FormArray;
    amortizations.clear();

    for (let month= 1; month <= data.get('duration_months')?.value; month++) {
      const interest = outstanding * monthlyRate;
      const amortized = quota - interest;     
      outstanding = outstanding - amortized;
      const date = addMonth(format(data.get('start_date')?.value, 'YYYY-MM-DD'), month - 1);
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
