import { Component, effect, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { SalaryService } from '../../services/salary.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Salary } from '@models/salary';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-sidebar-salary-data',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './sidebar-salary-data.component.html',
  styleUrl: './sidebar-salary-data.component.scss'
})
export class SidebarSalaryDataComponent {
  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  protected readonly _salaryService = inject(SalaryService);
  protected readonly form = this._salaryService.salaryForm();
  protected readonly isSubmitting = signal(false);
  salaryData = input< Salary>();

  constructor() {
    effect(() => {
      this.form().patchValue(this.salaryData()!);
    });
  }


  onSubmit() {
    if (this.form().valid) {
      this.isSubmitting.set(true);
      const salaryData = this.form().value;
      const promiseSalary = firstValueFrom(this._salaryService.updateSalary(this.salaryData()!.id!, salaryData));
      toast.promise(promiseSalary, {
        loading: 'Actualizando salario...',
        success: (res) => {
          this.onSave.emit();
          this.isSubmitting.set(false);
          return res.message;
        },
        error: 'Error al actualizar salario',
      })
   
 
    }
  }

  cancel() {
    this.onCancel.emit();
  }

  onDelete() {
    this.isSubmitting.set(true);
    const promiseSalary = firstValueFrom(this._salaryService.deleteSalary(this.salaryData()!.id!));
    toast.promise(promiseSalary, {
      loading: 'Eliminando salario...',
      success: (res) => {
     
        this.onSave.emit();
        this.isSubmitting.set(false);
        return res.message;
      },
      error: 'Error al eliminar salario',
    })
  }
}
