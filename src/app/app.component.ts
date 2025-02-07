import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { getToken, getMessaging, Messaging } from '@angular/fire/messaging';

import { RouterOutlet } from '@angular/router';

import { initFlowbite } from 'flowbite';
import { NgxSonnerToaster } from 'ngx-sonner';
import { environment } from '@environments/environment.development';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent {
  title = 'FinZen';
  ngOnInit(): void {
    document.documentElement.classList.add('dark');
    initFlowbite();
  }
}
