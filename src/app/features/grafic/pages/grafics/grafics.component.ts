import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { format } from '@formkit/tempo';
import { StorageService } from '@services/storage.service';
import { GraficService } from '../../services/grafic.service';
import { FormsModule } from '@angular/forms';
import { ChartMonthComponent } from "../../components/chart-month/chart-month.component";

@Component({
  selector: 'app-grafics',
  imports: [FormsModule, ChartMonthComponent],
  templateUrl: './grafics.component.html',
  styleUrl: './grafics.component.scss',
})
export default class GraficsComponent {
  protected readonly _storage = inject(StorageService);
  private readonly _graficService = inject(GraficService);
  startMonth = signal<any>(format(new Date(), 'MM', 'es'));
  startYear = signal<any>(format(new Date(), 'YYYY', 'es'));
  endMonth = signal<any>('');
  endYear = signal<any>('');
  userId = signal<number>(this._storage.getUserId());
  years: number[] = this.getYearList();

  filterValue = computed(() => ({
    ...(this.startMonth() && { startMonth: this.startMonth() }),
    ...(this.startYear() && { startYear: this.startYear() }),
    ...(this.endMonth() && { endMonth: this.endMonth() }),
    ...(this.endYear() && { endYear: this.endYear() }),
  }));

  currentMonthData = rxResource({
    request: () => ({ userId: this.userId(), filterValue: this.filterValue() }),
    loader: ({ request }) =>
      this._graficService.getDataByMonthRange(
        request.userId,
        request.filterValue
      ),
  });

  getYearList(): number[] {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 10; // Puedes ajustar el rango de años
    const years: number[] = [];
    for (let i = currentYear; i >= startYear; i--) {
      years.push(i);
    }
    return years;
  }

  onFilterChange() {
    // This will trigger the computed signal to update
    this.startMonth.update((x) => x);
    this.startYear.update((x) => x);
    this.endMonth.update((x) => x);
    this.endYear.update((x) => x);
  }

  clearFilters() {
    this.startMonth.set('');
    this.startYear.set('');
    this.endMonth.set('');
    this.endYear.set('');
  }
}
