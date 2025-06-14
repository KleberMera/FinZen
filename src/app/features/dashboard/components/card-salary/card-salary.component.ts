import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { SalaryService } from '../../services/salary.service';
import { format } from '@formkit/tempo';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Salary } from '@models/salary';
import { CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';
import { apiResponse } from '@models/apiResponse';
import { toast } from 'ngx-sonner';
import { SidebarSalaryDataComponent } from "../sidebar-salary-data/sidebar-salary-data.component";

@Component({
  selector: 'app-card-salary',
  imports: [ReactiveFormsModule, CurrencyPipe, SidebarSalaryDataComponent, DecimalPipe],
  templateUrl: './card-salary.component.html',
  styleUrl: './card-salary.component.scss',
})
export class CardSalaryComponent {
  protected readonly _storage = inject(StorageService);
  protected readonly _salaryService = inject(SalaryService);
  seletdUserId = signal(this._storage.getUserId());
  showMoreDetails = signal(false);
  openSideBar = signal(false);
  currentMonth = computed(() =>
    format(this.timeNow(), 'MMMM', this.lenguaje())
  );
  lenguaje = signal<string>('es');
  timeNow = signal<any>(new Date());


  currentMonthNumber = computed(() =>
    format(this.timeNow(), 'M', this.lenguaje())
  );
  currenDate = computed(() =>
    format(this.timeNow(), 'YYYY-MM-DD', this.lenguaje())
  );
  currenYear = computed(() => format(this.timeNow(), 'YYYY', this.lenguaje()));

  salaryForm = this._salaryService.salaryForm();

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  
  constructor() {
    effect(() => {
      this.salaryForm().patchValue({
        month_name: this.capitalizeFirstLetter(this.currentMonth()),
        effective_date: this.currenDate(),
      });
    });
  }

  salary = rxResource<
    apiResponse<Salary>,
    { userId: number; month: number; year: number }
  >({
    request: () => ({
      userId: this.seletdUserId(),
      month: parseInt(this.currentMonthNumber()),
      year: parseInt(this.currenYear()),
    }),
    loader: ({ request }) => this._salaryService.getSalaryByMonth(request.userId, request.month,request.year)
  });


 currentFinancialSumary = rxResource({
    request: () => ({
      userId: this.seletdUserId(),
      startMonth: parseInt(this.currentMonthNumber()),
      startYear: parseInt(this.currenYear()),
    }),
    loader: ({ request }) =>
      this._salaryService.getFinancialSummaryRange(
        request.userId,
        request.startMonth,
        request.startYear,   
        null,
        null
      ),
  });





  onSubmit() {
    if (this.salaryForm().valid) {
      const salaryData = {
        user_id: this.seletdUserId(),
        ...this.salaryForm().value,
      } as Salary;

      this._salaryService.createSalary(salaryData).subscribe({
        next: (response) => {
          // Recargar los datos del salario después de guardar
          this.salary.reload();
          this.currentFinancialSumary.reload();
          toast.success('Salario guardado correctamente');
        },
        error: (error) => {
          console.error('Error al guardar salario', error);
        },
      });
    }
  }



toggleSidebar() {
  this.openSideBar.set(!this.openSideBar());
}

reloadSalary() {
  this.salary.reload();
}

  // Método para manejar cuando se guarda una contribución
  handleSalarySaved() {
    this.toggleSidebar(); // Cerrar el sidebar
    this.reloadSalary(); // Recargar las contribuciones
    this.currentFinancialSumary.reload();
  }

 
}
