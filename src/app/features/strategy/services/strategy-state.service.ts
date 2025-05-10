import { Injectable, signal } from '@angular/core';
import { DebtData } from '../types/debt-types';

@Injectable({
  providedIn: 'root'
})
export default class StrategyStateService {
  selectedData = signal<DebtData | null>(null);

  setSelectedData(data: DebtData) {
    console.log(data);
    
    this.selectedData.set(data);
  }

  clearSelectedData() {
    this.selectedData.set(null);
  }
}
