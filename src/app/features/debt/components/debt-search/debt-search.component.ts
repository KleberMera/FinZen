import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-debt-search',
  imports: [FormsModule],
  templateUrl: './debt-search.component.html',
  styleUrl: './debt-search.component.scss'
})
export class DebtSearchComponent {
  searchTerm = input.required<string>();
  suggestions = input<string[]>([]);
  searchTermChange = output<string>();
}
