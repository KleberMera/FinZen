import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@shared/layout/navbar/navbar.component';
import { SidebarComponent } from '@shared/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  imports: [NavbarComponent, RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export default class LayoutComponent {

}
