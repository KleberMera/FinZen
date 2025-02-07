import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { NgxSonnerToaster } from 'ngx-sonner';
import { PushNotificationService } from '@services/push-notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent {
  title = 'FinZen';
  private readonly pushService = inject(PushNotificationService);
  async ngOnInit() {
    console.log('App component initialized');
    
    await this.pushService.initNotifications();
    document.documentElement.classList.add('dark');
    initFlowbite();
  }
}
