import { Component, inject, signal } from '@angular/core';
import { StorageService } from '../../../../shared/services/storage.service';


function getTimeBasedGreeting(): string {
  const now = new Date();
  const hour = now.getHours();
  if (hour >= 5 && hour < 12) {
    return 'Buenos días';
  } else if (hour >= 12 && hour < 19) {
    return 'Buenas tardes';
  } else {
    return 'Buenas noches';
  }
}


@Component({
  selector: 'app-dashboard-header',
  imports: [],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss',
})
export class DashboardHeaderComponent {
  protected readonly storage = inject(StorageService);

  name = signal<string>(this.storage.getName());
  rolIdUser = signal<number>(this.storage.getRole());
  greeting = signal<string>(getTimeBasedGreeting());
  private timeInterval?: number;
  currentTime = signal<string>('');
  currentDate = signal<string>('');

  ngOnInit() {
    this.updateTime();
    // Actualizar el tiempo cada minuto
    this.timeInterval = window.setInterval(() => {
      this.updateTime();
      this.greeting.set(getTimeBasedGreeting());
    }, 60000);
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private updateTime() {
    const now = new Date();
    this.currentTime.set(now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    }));
    this.currentDate.set(now.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }

  getCurrentTime(): string {
    return this.currentTime();
  }

  getCurrentDate(): string {
    return this.currentDate();
  }
}
