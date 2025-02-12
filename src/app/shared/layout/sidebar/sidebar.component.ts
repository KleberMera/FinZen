import { Component, input, output } from '@angular/core';
import { SidebarItemsComponent } from '../sidebar-items/sidebar-items.component';

@Component({
  selector: 'app-sidebar',
  imports: [SidebarItemsComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  isOpen = input(false);
  closeSidebar = output<void>();
}
