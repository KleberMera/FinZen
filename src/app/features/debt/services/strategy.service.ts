import { Injectable } from '@angular/core';
import { Salary } from '@models/salary';

@Injectable({
  providedIn: 'root'
})
export class StrategyService {

  setSalaryData(salaryData: Salary): void {
    console.log('Saldo:', salaryData);
  }


}
