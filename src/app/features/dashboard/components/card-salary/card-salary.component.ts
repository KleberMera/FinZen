import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { SalaryService } from '../../services/salary.service';
import { format } from '@formkit/tempo';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-card-salary',
  imports: [ReactiveFormsModule],
  templateUrl: './card-salary.component.html',
  styleUrl: './card-salary.component.scss',
})
export class CardSalaryComponent {
  protected readonly _storage = inject(StorageService);
  protected readonly _salaryService = inject(SalaryService);
  seletdUserId = signal(this._storage.getUserId());
  lenguaje = signal<string>('es');
  timeNow = signal<any>(new Date());
  private _fb = inject(FormBuilder);
  currentMonth = signal<any>(format(this.timeNow(), 'MMMM', this.lenguaje()));
  currenDate = signal<any>(format(this.timeNow(), 'YYYY-MM-DD', this.lenguaje()));

  salary = rxResource({
    request: () => ({
      userId: this.seletdUserId(),
      currentMonth: this.currentMonth(),
    }),
    loader: ({ request }) =>
      this._salaryService.getSalaryByMonth(
        request.userId,
        request.currentMonth
      ),
  });
  // Propiedades para el formulario
  // salaryForm: FormGroup = this._fb.group({
  //   salary_amount: [null, [Validators.required, Validators.min(0)]],
  //   effective_date: [new Date(), Validators.required],
  //   description: [''],
  //   month_name: ['', Validators.required],
  // });

  salaryForm = signal<FormGroup>(
    new FormGroup({
      salary_amount: new FormControl(null, [
        Validators.required,
        Validators.min(0),
      ]),
      effective_date: new FormControl(new Date(), Validators.required),
      description: new FormControl(''),
      month_name: new FormControl('', Validators.required),
    })
  );

  onSubmit() {
    if (this.salaryForm().valid) {
      const salaryData = {
        userId: this.seletdUserId(),
        effective_date: this.currenDate(),
        ...this.salaryForm().value,
      };

      console.log('salaryData: ', salaryData);
      this.salary.reload();

      // this._salaryService.createSalary(salaryData).subscribe({
      //   next: (response) => {
      //     // Recargar los datos del salario después de guardar
      //     this.salary.reload();
      //   },
      //   error: (error) => {
      //     console.error('Error al guardar salario', error);
      //   },
      // });
    }
  }

  constructor() {
    effect(() => {
      this.salaryForm().patchValue({
        month_name: this.capitalizeFirstLetter(this.currentMonth()),
      });
      console.log(
        'currentMonthSelected: ',
        this.capitalizeFirstLetter(this.currentMonth())
      );
    });
  }

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
