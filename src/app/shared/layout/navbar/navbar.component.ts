import { Component, input, OnInit, output, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from "../../icons/logo/logo.component";
import { NotificationComponent } from "../../ui/notification/notification.component";
import { UserMenuComponent } from "../../ui/user-menu/user-menu.component";
import { BarsDrawComponent } from "../../icons/bars-draw/bars-draw.component";


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, LogoComponent, NotificationComponent, UserMenuComponent, BarsDrawComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  sidebarOpen = input(false);
  toggleSidebar = output<void>();
  
}
