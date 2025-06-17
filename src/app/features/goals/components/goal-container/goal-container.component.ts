import { Component, input, output } from '@angular/core';
import { BottomSheetComponent } from "../../../../shared/components/bottom-sheet/bottom-sheet.component";
import { RegisterMetaComponent } from "../../pages/register-meta/register-meta.component";

@Component({
  selector: 'app-goal-container',
  imports: [BottomSheetComponent, RegisterMetaComponent],
  templateUrl: './goal-container.component.html',
  styleUrl: './goal-container.component.scss'
})
export class GoalContainerComponent {
  readonly isOpen = input(false);
  readonly closeUserSidebar = output<void>();
    readonly createSuccess = output<void>();
 close() {
    this.closeUserSidebar.emit();
  }

  onCreateSuccess() {
    this.createSuccess.emit();
  }
}
