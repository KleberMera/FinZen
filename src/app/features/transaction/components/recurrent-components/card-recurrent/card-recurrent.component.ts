import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Transaction } from '@models/transaction';
import { TransactionService } from '../../../services/transaction.service';
import { StorageService } from '@services/storage.service';
import { toast } from 'ngx-sonner';
interface RecurringTransaction {
  frequency: string;
  nextExecutionDate: string;
  endDate?: string;
  dayOfMonth?: number;
  dayOfWeek?: number;
}
@Component({
  selector: 'app-card-recurrent',
  imports: [
    CurrencyPipe,
    DatePipe,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './card-recurrent.component.html',
  styleUrl: './card-recurrent.component.scss',
})
export class CardRecurrentComponent {
  selectedTransaction = input.required<Transaction>();
  selectedType = input.required<string>();
  private readonly _storageService = inject(StorageService);
  protected readonly selectedUserId = signal<number>(
    this._storageService.getUserId()
  );
  // Output para enviar la transacción recurrente al componente padre
  @Output() saveRecurring = new EventEmitter<{
    transactionId: number;
    recurringData: RecurringTransaction;
  }>();
  protected readonly _transactionService = inject(TransactionService);

  // Formulario reactivo
  recurringForm: FormGroup;

  // Estado para controlar la frecuencia seleccionada
  selectedFrequency = signal<string>('Mensual');

  constructor(private fb: FormBuilder) {
    // Inicializar formulario
    this.recurringForm = this.fb.group({
      frequency: ['Mensual', Validators.required],
      nextExecutionDate: ['', Validators.required],
      endDate: [''],
      dayOfMonth: [null],
      dayOfWeek: [null],
    });

    // Observar cambios en la frecuencia
    this.recurringForm.get('frequency')?.valueChanges.subscribe((value) => {
      this.selectedFrequency.set(value);
      this.updateValidatorsBasedOnFrequency(value);
    });
  }

  // Actualizar validadores según la frecuencia seleccionada
  updateValidatorsBasedOnFrequency(frequency: string): void {
    const dayOfMonthControl = this.recurringForm.get('dayOfMonth');
    const dayOfWeekControl = this.recurringForm.get('dayOfWeek');

    // Reiniciar validadores
    dayOfMonthControl?.clearValidators();
    dayOfWeekControl?.clearValidators();

    // Aplicar validadores según frecuencia
    if (frequency === 'Mensual') {
      dayOfMonthControl?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(31),
      ]);
    } else if (frequency === 'Semanal') {
      dayOfWeekControl?.setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(6),
      ]);
    }

    // Actualizar estado de los controles
    dayOfMonthControl?.updateValueAndValidity();
    dayOfWeekControl?.updateValueAndValidity();
  }

  // Método para enviar el formulario
  onSubmit(): void {
    if (this.recurringForm.valid) {
      const recurringData: RecurringTransaction = {
        frequency: this.recurringForm.value.frequency,
        nextExecutionDate: this.recurringForm.value.nextExecutionDate,
        endDate: this.recurringForm.value.endDate || undefined,
        dayOfMonth: this.recurringForm.value.dayOfMonth || undefined,
        dayOfWeek: this.recurringForm.value.dayOfWeek || undefined,
      };

      this.saveRecurring.emit({
        transactionId: this.selectedTransaction().id!,
        recurringData,
      });


      this._transactionService
        .createRecurringTransaction(
          recurringData,
          this.selectedTransaction().id!,
          this.selectedUserId()
        )
        .subscribe({
          next: (response) => {
           // console.log('Transacción recurrente creada:', response);
            toast.success('Transaccion Recurrente Creada')
          },
        });
    }
  }

  // Método para cancelar
  cancel(): void {
    this.recurringForm.reset({
      frequency: 'Mensual',
    });
  }

  // Devuelve true si el formulario es válido
  isFormValid(): boolean {
    return this.recurringForm.valid;
  }
}
