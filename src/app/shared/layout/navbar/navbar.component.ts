import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from "../../icons/logo/logo.component";
import { NotificationComponent } from "../../ui/notification/notification.component";
import { AppsComponent } from "../../ui/apps/apps.component";
import { UserMenuComponent } from "../../ui/user-menu/user-menu.component";
import { BarsDrawComponent } from "../../icons/bars-draw/bars-draw.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, LogoComponent, NotificationComponent, UserMenuComponent, BarsDrawComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Opcional: Cerrar menú si se hace clic fuera
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!event.target.closest('#mobile-menu-toggle') && !event.target.closest('#mobile-menu')) {
      this.isMobileMenuOpen = false;
    }
  }
}
