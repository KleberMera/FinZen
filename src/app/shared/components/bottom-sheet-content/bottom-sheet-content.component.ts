import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bottom-sheet-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bottom-sheet-content.component.html',
  styleUrl: './bottom-sheet-content.component.scss'
})
export class BottomSheetContentComponent {
  readonly title = input<string>('');
  readonly closeSheet = output<void>();

  close() {
    this.closeSheet.emit();
  }
}