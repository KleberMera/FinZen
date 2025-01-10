import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-card-table',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './card-table.component.html',
  styleUrl: './card-table.component.scss'
})
export class CardTableComponent {
  readonly formData = input.required<FormGroup>();
  readonly totalMonths = signal<number>(0);


  ngOnInit() {
    const amortizations = this.formData().get('amortizations')?.value || [];
    this.totalMonths.set(amortizations.length);
  }
  
}
