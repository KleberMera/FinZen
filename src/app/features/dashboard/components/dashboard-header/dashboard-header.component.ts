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
  greeting = signal<string>(getTimeBasedGreeting());
}
