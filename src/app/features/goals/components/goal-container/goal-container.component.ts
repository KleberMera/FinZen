import { Component, input, output } from '@angular/core';
import { BottomSheetComponent } from "../../../../shared/components/bottom-sheet/bottom-sheet.component";
import { RegisterMetaComponent } from "../../pages/register-meta/register-meta.component";
import { GoalRegisterComponent } from "../goal-register/goal-register.component";

@Component({
  selector: 'app-goal-container',
  imports: [BottomSheetComponent, GoalRegisterComponent],
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
