import { Component, input, output, signal } from '@angular/core';
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
  private collapsed = signal(false);

  isCollapsed() {
    return this.collapsed();
  }

  toggleSidebarCollapse() {
    this.collapsed.update(value => !value);
  }

  onItemSelected() {
    if (window.innerWidth < 768) {
      this.closeSidebar.emit();
    }
  }
}
