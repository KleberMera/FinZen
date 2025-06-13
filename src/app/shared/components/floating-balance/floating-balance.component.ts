import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceService } from '../../../features/dashboard/services/balance.service';
import { StorageService } from '../../../services/storage.service';
import { AuthStateService } from '../../../services/auth-state.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-floating-balance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-balance.component.html',
  styleUrls: ['./floating-balance.component.scss']
})
export class FloatingBalanceComponent implements OnInit {
  private readonly _balanceService = inject(BalanceService);
  private readonly _storageService = inject(StorageService);
  private readonly _authStateService = inject(AuthStateService);

  isAuthenticated = signal<boolean>(false);
  userId = signal<number>(0);
  
  // Obtener fecha actual para los parámetros del balance
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth() + 1; // getMonth() devuelve 0-11
  currentYear = this.currentDate.getFullYear();
  previousMonth = this.currentMonth === 1 ? 12 : this.currentMonth - 1;
  previousYear = this.currentMonth === 1 ? this.currentYear - 1 : this.currentYear;

  // Recurso para obtener el balance
  balanceResource = rxResource({
    request: () => ({
      userId: this.userId(),
      currentMonth: this.currentMonth,
      currentYear: this.currentYear,
      previousMonth: this.previousMonth,
      previousYear: this.previousYear
    }),
    loader: ({ request }) => this._balanceService.getBalanceByUserId(
      request.userId,
      request.currentMonth,
      request.currentYear,
      request.previousMonth,
      request.previousYear
    ),
  });

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    const token = this._authStateService.getSession();
    this.isAuthenticated.set(!!token);
    
    if (this.isAuthenticated()) {
      // Obtener el ID del usuario
      this.userId.set(this._storageService.getUserId());
      
      // Cargar el balance
      this.balanceResource.reload();
    }
  }

  // Método para formatear el número (redondear y formatear como moneda)
  formatBalance(balance: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(balance);
  }
}