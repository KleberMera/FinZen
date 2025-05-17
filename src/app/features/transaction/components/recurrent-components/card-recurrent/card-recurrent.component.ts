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
import { StorageService } from '@services/storage.service';
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

  constructor(private fb: FormBuilder) {
    // Inicializar el formulario primero
    this.recurringForm = this.fb.group({
      frequency: ['Mensual', Validators.required],
      nextExecutionDate: ['', Validators.required],
      endDate: [''],
      dayOfMonth: [null],
      dayOfWeek: [null],
    });

 effect(() => {
   // Configurar los valores iniciales basados en la transacción
   this.initializeFormValues();
    
   // Configurar observables
   this.setupFormObservables();
 })
  }
  
  private initializeFormValues(): void {
    console.log(this.selectedTransaction().date);

    const nextExecutionDate = format(addMonth(this.selectedTransaction().date, 1), 'YYYY-MM-DD', 'es');
    console.log(nextExecutionDate);
    
    const transactionDate = nextExecutionDate;
    const dayOfMonth = parseInt(transactionDate.split('-')[2]);
    

    
    // Establecer los valores iniciales
    this.recurringForm.patchValue({
      dayOfMonth: dayOfMonth,
      nextExecutionDate:  nextExecutionDate
    }, { emitEvent: false });
    
    // Establecer la frecuencia inicial
    this.selectedFrequency.set('Mensual');
  }
  
  private setupFormObservables(): void {
    // Observar cambios en la frecuencia
    this.recurringForm.get('frequency')?.valueChanges.subscribe((value) => {
      this.selectedFrequency.set(value);
      this.updateValidatorsBasedOnFrequency(value);
    });
    
    // Observar cambios en el día del mes para actualizar la próxima fecha de ejecución
    this.recurringForm.get('dayOfMonth')?.valueChanges.subscribe((day) => {
      if (day && this.recurringForm.get('frequency')?.value === 'Mensual') {
        this.updateNextExecutionDate(parseInt(day, 10));
      }
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
      
      // Si no hay un día del mes establecido, usar el día de la transacción
      if (!dayOfMonthControl?.value) {
        const transactionDate = new Date(this.selectedTransaction().date);
        dayOfMonthControl?.setValue(transactionDate.getDate());
      }
    } else if (frequency === 'Semanal') {
      // Si ya hay un día de la semana establecido, mantener los validadores
      if (dayOfWeekControl?.value) {
        dayOfWeekControl?.setValidators([
          Validators.required,
          Validators.min(0),
          Validators.max(6),
        ]);
      }
    }

    // Actualizar estado de los controles
    dayOfMonthControl?.updateValueAndValidity();
    dayOfWeekControl?.updateValueAndValidity();
  }
  
  // Actualizar la próxima fecha de ejecución basada en el día del mes
  private updateNextExecutionDate(day: number): void {
    if (day < 1 || day > 31) return;
    
    const transactionDate = new Date(this.selectedTransaction().date);
    const nextExecutionDate = new Date(transactionDate);
    
    // Establecer el día del mes, manejando meses con diferente cantidad de días
    const lastDayOfMonth = new Date(
      nextExecutionDate.getFullYear(), 
      nextExecutionDate.getMonth() + 2, 
      0
    ).getDate();
    
    // Si el día seleccionado es mayor que el último día del mes, usar el último día
    const dayToSet = Math.min(day, lastDayOfMonth);
    
    // Establecer el mes siguiente y el día
    nextExecutionDate.setMonth(nextExecutionDate.getMonth() + 1, dayToSet);
    
    // Formatear la fecha para el input date (YYYY-MM-DD)
    const formattedDate = nextExecutionDate.toISOString().split('T')[0];
    
    // Actualizar el valor del formulario sin emitir eventos para evitar bucles
    this.recurringForm.get('nextExecutionDate')?.setValue(formattedDate, { emitEvent: false });
  }
  protected readonly isSubmitting = signal(false);
  // Método para enviar el formulario
  onSubmit(): void {
    if (this.recurringForm.valid) {
      this.isSubmitting.set(true);
      const recurringData: RecurringTransaction = {
        frequency: this.recurringForm.value.frequency,
        nextExecutionDate: format(this.recurringForm.value.nextExecutionDate, 'YYYY-MM-DD', 'es'),
        endDate: this.recurringForm.value.endDate ? format(this.recurringForm.value.endDate, 'YYYY-MM-DD', 'es') : undefined,
        dayOfMonth: this.recurringForm.value.dayOfMonth || undefined,
        dayOfWeek: this.recurringForm.value.dayOfWeek || undefined,
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
          return 'Transacción recurrente eliminada'
        },
    
      }
    )
    

  }
}
