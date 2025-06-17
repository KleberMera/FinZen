import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleGradient } from '@models/styleClass';

@Component({
  selector: 'app-side-sheet-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-sheet-content.component.html',
  styleUrl: './side-sheet-content.component.scss'
})
export class SideSheetContentComponent {
  readonly title = input<string>('');
  readonly titleClasses = input<string>('');
  private readonly baseClasses = `flex items-center gap-3 text-xl font-bold ${TitleGradient.INDIGO_PURPLE} bg-clip-text text-transparent`;

  getTitleClasses(): string {
    return this.titleClasses() ? `${this.baseClasses} ${this.titleClasses()}` : this.baseClasses;
  }

  readonly closeSheet = output<void>();

  close() {
    this.closeSheet.emit();
  }
}