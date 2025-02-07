import { Component, inject } from '@angular/core';
import { Messaging } from '@angular/fire/messaging';
import { RouterOutlet } from '@angular/router';
import { NotificationService } from '@services/notification.service';
import { initFlowbite } from 'flowbite';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'FinZen';
  constructor(private notificationService: NotificationService) {
    this.notificationService.requestPermission();
    this.notificationService.listenMessages();
  }
  

  ngOnInit(): void {
    //Modo Oscuro por defecto
    document.documentElement.classList.add('dark');
    initFlowbite();
    
  }
}
