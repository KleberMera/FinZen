import { Component, input, output } from '@angular/core';
import { Amortization } from '@models/amortization';
import { SidebarDebDetailsComponent } from "../sidebar-deb-details/sidebar-deb-details.component";
import { BottomSheetComponent } from "../../../../shared/components/bottom-sheet";

@Component({
  selector: 'app-debt-sidebar-container',
  templateUrl: './debt-sidebar-container.component.html',
  standalone: true,
  imports: [SidebarDebDetailsComponent, BottomSheetComponent]
})
export class DebtSidebarContainerComponent {
  readonly isOpen = input(false);
  readonly closeUserSidebar = output<void>();
  readonly debtId = input.required<number>();
  readonly amortization = input.required<Amortization>();

  readonly updateSuccess = output<void>();

  close() {
    this.closeUserSidebar.emit();
  }

  onUpdateSuccess() {
    this.updateSuccess.emit();
  }
}
