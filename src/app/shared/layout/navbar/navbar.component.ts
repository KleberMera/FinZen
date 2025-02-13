import { Component, EventEmitter, inject, input, Output, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from "../../icons/logo/logo.component";
import { PushNotificationService } from '@services/push-notification.service';
import { toast } from 'ngx-sonner';
import { UserProfileSidebarComponent } from "./components/user-profile-sidebar/user-profile-sidebar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, LogoComponent, UserProfileSidebarComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  sidebarOpen = input(false);
  toggleSidebar = output<void>();
  toggleSidebarUser = output<void>();
  isUserSidebarOpen = signal(false);

  onUserClick() {
    this.isUserSidebarOpen.update(value => !value);
  }

  closeUserSidebar() {
    this.isUserSidebarOpen.set(false);
  }

  private readonly pushService = inject(PushNotificationService);


  async onNotificationClick() {
    const success = await this.pushService.requestSubscription();
    if (success) {
      console.log(success);
      
      console.log('Notificaciones activadas correctamente');
      toast.success('Notificaciones activadas correctamente');
    } else {
      console.error('No se pudieron activar las notificaciones');
      toast.error('No se pudieron activar las notificaciones');
    }
  }
  

}
