import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BalanceService } from '../../../features/dashboard/services/balance.service';
import { StorageService } from '../../../services/storage.service';
import { AuthStateService } from '../../../services/auth-state.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { SalaryService } from '../../../features/dashboard/services/salary.service';
import { format } from '@formkit/tempo';
import { FinanceSummary } from '@models/finance';
import { apiResponse } from '@models/apiResponse';

@Component({
  selector: 'app-floating-balance',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './floating-balance.component.html',
  styleUrls: ['./floating-balance.component.scss']
})
export class FloatingBalanceComponent implements OnInit {
 

  isAuthenticated = signal<boolean>(false);

  
  private readonly _storageService = inject(StorageService);
  private readonly _salaryService = inject(SalaryService);
  private readonly _authStateService = inject(AuthStateService);

  protected readonly seletedUser = signal<number>(
    this._storageService.getUserId()
  );
  public readonly stateReset = signal(false);

  lenguaje = signal<string>('es');
  timeNow = signal<any>(new Date());

  currentMonth = computed(() =>
    format(this.timeNow(), 'MMMM', this.lenguaje())
  );

  currentMonthNumber = computed(() =>
    format(this.timeNow(), 'M', this.lenguaje())
  );
  currenDate = computed(() =>
    format(this.timeNow(), 'YYYY-MM-DD', this.lenguaje())
  );
  currenYear = computed(() => format(this.timeNow(), 'YYYY', this.lenguaje()));

  salaryData = rxResource<
    apiResponse<FinanceSummary>,
    { userId: number; currentMonth: number; year: number }
  >({
    request: () => ({
      userId: this.seletedUser(),
      currentMonth: parseInt(this.currentMonthNumber()),
      year: parseInt(this.currenYear()),
    }),
    loader: ({ request }) =>
      this._salaryService.getFinancialSummary(
        request.userId,
        request.currentMonth,
        request.year
      ),
  });

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    const token = this._authStateService.getSession();
    this.isAuthenticated.set(!!token);
    
    if (this.isAuthenticated()) {
      // Obtener el ID del usuario
      //this.userId.set(this._storageService.getUserId());
      
      // Cargar el balance
      //this.balanceResource.reload();
    }

    // Calcula la posición inicial en la esquina inferior derecha
    this.setInitialPosition();
    // Recalcula la posición cuando la ventana cambie de tamaño
    window.addEventListener('resize', () => this.setInitialPosition());
  }

  private setInitialPosition() {
    // Aumentamos el padding a 32px (equivalente a right-8 y bottom-8)
    const padding = 32;
    // Ajustamos el offset para el tamaño del botón
    const buttonSize = 64; // aproximadamente el tamaño del botón circular
    
    this.position.set({
      x: window.innerWidth - buttonSize - padding,
      y: window.innerHeight - buttonSize - padding
    });
  }

  position = signal({ x: 0, y: 0 });
  isDragging = signal(false);
  offset = { x: 0, y: 0 };

  onMouseDown(event: MouseEvent) {
    this.isDragging.set(true);
    const element = event.target as HTMLElement;
    const rect = element.getBoundingClientRect();
    this.offset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging()) {
      this.position.set({
        x: event.clientX - this.offset.x,
        y: event.clientY - this.offset.y
      });
    }
  }

  onMouseUp() {
    this.isDragging.set(false);
  }
}