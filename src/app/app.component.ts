import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { NgxSonnerToaster } from 'ngx-sonner';
import { PushNotificationService } from '@services/push-notification.service';
import { Messaging } from '@angular/fire/messaging';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent {
  title = 'FinZen';

  async ngOnInit() {
    document.documentElement.classList.add('dark');
    initFlowbite();
  }
}
