import { Component, Output, EventEmitter, input, output } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Amortization } from '@models/amortization';
import { SidebarDebDetailsComponent } from "../sidebar-deb-details/sidebar-deb-details.component";


@Component({
  selector: 'app-debt-sidebar-container',
  templateUrl: './debt-sidebar-container.component.html',
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ],
  imports: [SidebarDebDetailsComponent]
})
export class DebtSidebarContainerComponent {
  readonly isOpen = input(false);
  readonly debtId = input.required<number>();
  readonly amortization = input.required<Amortization>();
  readonly closeUserSidebar = output<void>();
  readonly updateSuccess = output<void>();
 // @Output() updateSuccess = new EventEmitter<void>();

  close() {
    this.closeUserSidebar.emit();
  }

  onUpdateSuccess() {
    this.updateSuccess.emit();
  }
}
