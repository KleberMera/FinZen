import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Transaction } from '@models/transaction';

@Component({
  selector: 'app-card-recurrent',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './card-recurrent.component.html',
  styleUrl: './card-recurrent.component.scss'
})
export class CardRecurrentComponent {
  selectedTransaction = input.required<Transaction>();
  selectedType = input.required<string>()

}
