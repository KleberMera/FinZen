import { AsyncPipe, CurrencyPipe, DatePipe, NgFor } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Debt } from '@models/debt';

@Component({
  selector: 'app-card-details',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.scss'
})
export class CardDetailsComponent {
  readonly debts = input.required<Debt[]>()


 

}
