import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { addDay, addMonth, format } from '@formkit/tempo';

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
    console.log(amortizations.value);
    console.log(data.value);
    
 
    
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
          status: new FormControl('Pendiente')
        })
      );

    }

    data.get('amortizations')?.updateValueAndValidity();
  }


  calculateNoneAmortization(data: FormGroup) {
    const loanAmount = data.get('amount')?.value;
    const annualInterestRate = data.get('interest_rate')?.value / 100;
    const durationType = data.get('duration_type')?.value; // 'days' o 'months'
    const duration = data.get('duration_months')?.value; // Número de días o meses
  
    let periods: number;
    let ratePerPeriod: number;
  
    if (durationType === 'months') {
      periods = duration;
      ratePerPeriod = annualInterestRate / 12;
    } else if (durationType === 'days') {
      periods = duration;
      ratePerPeriod = annualInterestRate / 365; // Ajustar según convención (360/365)
    } else {
      return;
    }
  
    const fixedAmortization = loanAmount / periods;
    let outstanding = loanAmount;
  
  
    
    const amortizations = data.get('amortizations') as FormArray;
    console.log(amortizations.value);
    console.log(data.value);
    
    amortizations.clear();
  
    let currentDate = format(data.get('start_date')?.value, 'YYYY-MM-DD');
    console.log('currentDate ', currentDate);
    
  
    for (let period = 1; period <= periods; period++) {
      const interest = outstanding * ratePerPeriod;
      const quota = fixedAmortization + interest;
      outstanding -= fixedAmortization;
  
      // Actualizar fecha según tipo de duración
      currentDate = format(durationType === 'months' ? addMonth(currentDate, 1) : addDay(currentDate, 1), 'YYYY-MM-DD');
  
      amortizations.push(
        new FormGroup({
          number_months: new FormControl(period),
          date: new FormControl(format(currentDate, 'YYYY-MM-DD')),
          quota: new FormControl(quota.toFixed(2)),
          interest: new FormControl(interest.toFixed(2)),
          amortized: new FormControl(fixedAmortization.toFixed(2)),
          outstanding: new FormControl(outstanding.toFixed(2)),
          status: new FormControl('Pendiente')
        })
      );

      console.log(amortizations.value);
    }
  }


 

   totalMonths(data: FormGroup) {
     const amortizations = data.get('amortizations') as FormArray;
     return amortizations.length;
   }




   calculateGermanAmortization(data: FormGroup) {
    const monthlyRate = (data.get('interest_rate')?.value / 100) / 12;
    const loanAmount = data.get('amount')?.value;
    const durationMonths = data.get('duration_months')?.value;
    
    // En el sistema alemán, la amortización es constante
    const fixedAmortization = loanAmount / durationMonths;
    let outstanding = loanAmount;
    
    const amortizations = data.get('amortizations') as FormArray;
    amortizations.clear();
  
    for (let month = 1; month <= durationMonths; month++) {
      // Calculamos el interés sobre el saldo pendiente
      const interest = outstanding * monthlyRate;
      
      // La cuota es la suma de la amortización fija más los intereses
      const quota = fixedAmortization + interest;
      
      // Actualizamos el saldo pendiente
      outstanding = outstanding - fixedAmortization;
  
      const date = addMonth(format(data.get('start_date')?.value, 'YYYY-MM-DD'), month - 1);
      
      amortizations.push(
        new FormGroup({
          number_months: new FormControl(month),
          date: new FormControl(format(date, 'YYYY-MM-DD')),
          quota: new FormControl(quota),
          interest: new FormControl(interest),
          amortized: new FormControl(fixedAmortization),
          outstanding: new FormControl(outstanding),
          status: new FormControl('Pendiente')
        })
      );
    }
  }
}
