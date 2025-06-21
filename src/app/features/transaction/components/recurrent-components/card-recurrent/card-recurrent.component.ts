import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, effect, EventEmitter, inject, input, Output, signal, viewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Transaction } from '@models/transaction';
import { TransactionService } from '../../../services/transaction.service';
import { StorageService } from '../../../../../shared/services/storage.service';
import { toast } from 'ngx-sonner';
import { addMonth, format } from '@formkit/tempo';
import { firstValueFrom } from 'rxjs';
import RecurrentComponent from '../../../pages/recurrent/recurrent.component';
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
    readonly recurrentC = viewChild(RecurrentComponent);
  protected readonly selectedUserId = signal<number>(
    this._storageService.getUserId()
  );
  // Output para enviar la transacción recurrente al componente padre
  @Output() saveRecurring = new EventEmitter<{
    transactionId: number;
    recurringData: RecurringTransaction;
  }>();

  @Output() reloadTransactionsEvent = new EventEmitter<void>();
  
  protected readonly _transactionService = inject(TransactionService);

  // Formulario reactivo
  recurringForm: FormGroup;
  // Estado para controlar la frecuencia seleccionada
  selectedFrequency = signal<string>('Mensual');

  // Opciones de frecuencia
  readonly frequencyOptions = ['Mensual', 'Quincenal', 'Semanal', 'Personalizada'];

  constructor(private fb: FormBuilder) {
    // Inicializar el formulario primero
    this.recurringForm = this.fb.group({
      frequency: ['Mensual', Validators.required],
      nextExecutionDate: ['', Validators.required],
      endDate: [''],
      dayOfMonth: [{ value: null, disabled: true }], // solo visible, no editable
    });

    effect(() => {
      this.initializeFormValues();
      this.setupFormObservables();
    })
  }

  private initializeFormValues(): void {
    const nextExecutionDate = format(addMonth(this.selectedTransaction().date, 1), 'YYYY-MM-DD', 'es');
    const dayOfMonth = parseInt(nextExecutionDate.split('-')[2]);
    this.recurringForm.patchValue({
      dayOfMonth: dayOfMonth,
      nextExecutionDate: nextExecutionDate
    }, { emitEvent: false });
    this.selectedFrequency.set('Mensual');
  }

  private setupFormObservables(): void {
    // Cambios en frecuencia
    this.recurringForm.get('frequency')?.valueChanges.subscribe((value) => {
      this.selectedFrequency.set(value);
      this.updateNextExecutionDateByFrequency(value);
    });
    // Cambios en próxima ejecución
    this.recurringForm.get('nextExecutionDate')?.valueChanges.subscribe((date) => {
      if (date) {
        const day = parseInt(date.split('-')[2]);
        this.recurringForm.get('dayOfMonth')?.setValue(day, { emitEvent: false });
      }
    });
  }

  // Actualiza la próxima ejecución según frecuencia
  private updateNextExecutionDateByFrequency(frequency: string): void {
    const baseDate = new Date(this.selectedTransaction().date);
    let nextDate: Date;
    if (frequency === 'Mensual') {
      nextDate = addMonth(baseDate, 1);
    } else if (frequency === 'Semanal') {
      nextDate = new Date(baseDate);
      nextDate.setDate(baseDate.getDate() + 7);
    } else if (frequency === 'Quincenal') {
      nextDate = new Date(baseDate);
      nextDate.setDate(baseDate.getDate() + 15);
    } else {
      // Personalizada: no autocalcular
      return;
    }
    const formatted = format(nextDate, 'YYYY-MM-DD', 'es');
    this.recurringForm.patchValue({ nextExecutionDate: formatted }, { emitEvent: false });
    this.recurringForm.get('dayOfMonth')?.setValue(nextDate.getDate(), { emitEvent: false });
  }

  protected readonly isSubmitting = signal(false);
  // Método para enviar el formulario
  onSubmit(): void {
    if (this.recurringForm.valid) {
      this.isSubmitting.set(true);
      // Si la frecuencia es personalizada, guardar como 'Mensual' en la BD
      let freq = this.recurringForm.value.frequency;
      if (freq === 'Personalizada') {
        freq = 'Mensual';
      }
      const recurringData: RecurringTransaction = {
        frequency: freq,
        nextExecutionDate: format(this.recurringForm.value.nextExecutionDate, 'YYYY-MM-DD', 'es'),
        endDate: this.recurringForm.value.endDate ? format(this.recurringForm.value.endDate, 'YYYY-MM-DD', 'es') : undefined,
        dayOfMonth: this.recurringForm.get('dayOfMonth')?.value || undefined,
      };

      this.saveRecurring.emit({
        transactionId: this.selectedTransaction().id!,
        recurringData,
      });

      console.log('TRANSACCION', recurringData);
      

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
            this.reloadTransactionsEvent.emit();
            this.recurringForm.reset()
            
            this.isSubmitting.set(false)
            this.recurringForm.patchValue({
              frequency: 'Mensual',
              nextExecutionDate: '',
              endDate: '',
              dayOfMonth: null,
              dayOfWeek: null,
            })
          },
        });
    }
  }

  // Método para cancelar
  cancel(): void {
 
  }

  // Devuelve true si el formulario es válido
  isFormValid(): boolean {
    return this.recurringForm.valid;
  }


  deleteRecurringTransaction(id: number): void {
    console.log(id);

    const promise = firstValueFrom(
      this._transactionService.deleteTransactionRecurring(id, this.selectedUserId())
    );

    toast.promise(
      promise,
      {
        loading: 'Eliminando transacción recurrente...',
        success: (res) => {
          console.log(res);
          this.recurringForm.reset()
          this.isSubmitting.set(false)
          this.reloadTransactionsEvent.emit();
          this.recurringForm.patchValue({
            frequency: 'Mensual',
            nextExecutionDate: '',
            endDate: '',
            dayOfMonth: null,
            dayOfWeek: null,
          })
          return 'Transacción recurrente eliminada'
        },
    
      }
    )
    

  }
}
