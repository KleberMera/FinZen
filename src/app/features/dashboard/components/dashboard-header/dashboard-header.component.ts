import { Component, inject, signal } from '@angular/core';
import { StorageService } from '@services/storage.service';
import { format } from '@formkit/tempo';

function getTimeBasedGreeting(): string {
  const hour = format(new Date(), 'h:mm a', 'es');

  if (hour >= '5:00 AM' && hour < '12:00 PM') {
    return 'Buenos días';
  } else if (hour >= '12:00 PM' && hour < '7:00 PM') {
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
