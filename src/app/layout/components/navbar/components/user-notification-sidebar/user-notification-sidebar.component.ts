import { Component, inject, output, signal } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-notification-sidebar',
  imports: [DatePipe],
  templateUrl: './user-notification-sidebar.component.html',
  styleUrl: './user-notification-sidebar.component.scss',
})
export class UserNotificationSidebarComponent {
  protected readonly _storage = inject(StorageService);
  protected readonly _notifications = inject(NotificationService);
  
  // Señales para controlar los filtros
  protected readonly _filterType = signal<'all' | 'read' | 'unread'>('unread'); // Por defecto no leídas
  protected readonly _includeAllDebts = signal<boolean>(true); // Por defecto incluir todas las deudas

  closeUserSidebar = output<void>();
  userId = signal<number>(this._storage.getUserId());

  close() {
    this.closeUserSidebar.emit();
  }

  // Resource reactivo que se actualiza cuando cambian los filtros
  notificationsResource = rxResource({
    request: () => ({ 
      userId: this.userId(), 
      filterType: this._filterType(),
      includeAllDebts: this._includeAllDebts()
    }),
    loader: ({ request }) => {
      let isRead: string | undefined;
      let includeAllDebts: string | undefined;
      
      // Determinar parámetros según el tipo de filtro
      switch (request.filterType) {
        case 'all':
          // Para "todas", no enviamos isRead para obtener todas las notificaciones
          isRead = undefined;
          break;
        case 'read':
          isRead = 'true';
          break;
        case 'unread':
          isRead = 'false';
          break;
      }

      // Convertir boolean a string para includeAllDebts
      includeAllDebts = request.includeAllDebts ? 'true' : 'false';

      return this._notifications.getfilterNotificationsByUserId(
        request.userId, 
        isRead, 
        undefined, // debtId - por ahora undefined
        includeAllDebts
      );
    },
  });

  // Métodos para cambiar los filtros
  setFilter(filterType: 'all' | 'read' | 'unread'): void {
    this._filterType.set(filterType);
  }

  // Alternar filtro de incluir todas las deudas
  toggleIncludeAllDebts(): void {
    this._includeAllDebts.set(!this._includeAllDebts());
  }

  // Marcar una notificación específica como leída
  markAsRead(notificationId: number): void {
    this._notifications.markNotificationAsRead(this.userId(), notificationId).subscribe({
      next: () => {
        // Recargar las notificaciones después de marcar como leída
        this.notificationsResource.reload();
      },
      error: (error) => {
        console.error('Error al marcar notificación como leída:', error);
        // Aquí puedes agregar manejo de errores (toast, etc.)
      }
    });
  }

  // Marcar todas las notificaciones como leídas
  markAllAsRead(): void {
    const notifications = this.notificationsResource.value()?.data || [];
    const unreadNotifications = notifications.filter((n: any) => !n.isRead);
    
    if (unreadNotifications.length === 0) return;

    // Marcar todas las no leídas como leídas
    const markRequests = unreadNotifications.map((notification: any) => 
      this._notifications.markNotificationAsRead(this.userId(), notification.id)
    );

    // Ejecutar todas las peticiones en paralelo
    forkJoin(markRequests).subscribe({
      next: () => {
        // Recargar las notificaciones después de marcar todas como leídas
        this.notificationsResource.reload();
      },
      error: (error: any) => {
        console.error('Error al marcar todas las notificaciones como leídas:', error);
        // Aquí puedes agregar manejo de errores
      }
    });
  }

  // Getter para mostrar el estado actual del filtro en la UI
  get currentFilterLabel(): string {
    switch (this._filterType()) {
      case 'all': return 'Todas';
      case 'read': return 'Leídas';
      case 'unread': return 'No leídas';
      default: return 'No leídas';
    }
  }

  // Getter para contar notificaciones no leídas
  get unreadCount(): number {
    const notifications = this.notificationsResource.value()?.data || [];
    return notifications.filter((n: any) => !n.isRead).length;
  }
  
}
