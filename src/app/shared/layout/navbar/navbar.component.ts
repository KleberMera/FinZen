import { Component, OnInit, Renderer2 } from '@angular/core';
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
export class NavbarComponent implements OnInit {
  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.setupDrawerToggle();
  }

  private setupDrawerToggle() {
    // Seleccionar el botón de toggle y el drawer
    const drawerToggle = document.querySelector('[data-drawer-toggle="drawer-navigation"]');
    const drawer = document.getElementById('drawer-navigation');

    if (drawerToggle && drawer) {
      // Añadir event listener al botón
      drawerToggle.addEventListener('click', () => {
        drawer.classList.toggle('-translate-x-full');
      });

      // Cerrar drawer al hacer clic fuera (opcional)
      this.renderer.listen('document', 'click', (event: MouseEvent) => {
        const isClickInsideDrawer = drawer.contains(event.target as Node);
        const isClickOnToggle = drawerToggle.contains(event.target as Node);

        if (!isClickInsideDrawer && !isClickOnToggle && !drawer.classList.contains('-translate-x-full')) {
          drawer.classList.add('-translate-x-full');
        }
      });

      // Manejo responsive
      this.renderer.listen('window', 'resize', () => {
        if (window.innerWidth >= 768) {
          drawer.classList.remove('-translate-x-full');
        } else {
          drawer.classList.add('-translate-x-full');
        }
      });
    }
  }
}
