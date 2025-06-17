import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleGradient } from '@models/styleClass';


@Component({
  selector: 'app-bottom-sheet-content',
  standalone: true,
  imports: [],
  templateUrl: './bottom-sheet-content.component.html',
  styleUrl: './bottom-sheet-content.component.scss'
})
export class BottomSheetContentComponent {
  readonly title = input<string>('');
  readonly titleClasses = input<string>(`flex items-center gap-3 text-xl font-bold ${TitleGradient.INDIGO_PURPLE} bg-clip-text text-transparent`);

  readonly closeSheet = output<void>();

  close() {
    this.closeSheet.emit();
  }
}

