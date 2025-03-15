import { Component, input, output } from '@angular/core';
import { Debt } from '@models/debt';

@Component({
  selector: 'app-sidebar-deb-details',
  imports: [],
  templateUrl: './sidebar-deb-details.component.html',
  styleUrl: './sidebar-deb-details.component.scss'
})
export class SidebarDebDetailsComponent {
  closeUserSidebar = output<void>();
    readonly debt = input.required<Debt>(); // Recibe la transacción seleccionada

  close() {
    this.closeUserSidebar.emit();
  }
}
