import { Component, inject, signal } from '@angular/core';
import { TitleGradient } from '@models/styleClass';
import { BottomSheetComponent, BottomSheetContentComponent } from '../bottom-sheet';
import { PwaService } from '../../services/pwa.service';

@Component({
  selector: 'app-pwa-install',
  imports: [ BottomSheetComponent, BottomSheetContentComponent],
  template: `
    @if (pwaService.isInstallable()) {
      <button 
        (click)="showInstallPrompt()"
        class="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
        <i class="pi pi-download"></i>
        <span>Instalar App</span>
      </button>

      <app-bottom-sheet [isOpen]="showPrompt()" (closeSheet)="closePrompt()">
        <app-bottom-sheet-content 
          [title]="'Instalar FinZen'" 
          [titleClasses]="TitleGradient.INDIGO_PURPLE"
          (closeSheet)="closePrompt()">
          
          <div class="space-y-4 mb-6">
            <p class="text-gray-600 dark:text-gray-300">
              Instala FinZen en tu dispositivo para:
            </p>
            <ul class="space-y-3">
              <li class="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <i class="pi pi-check-circle text-emerald-500"></i>
                <span>Acceso rápido desde tu pantalla de inicio</span>
              </li>
              <li class="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <i class="pi pi-check-circle text-emerald-500"></i>
                <span>Mejor experiencia de usuario</span>
              </li>
              <li class="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <i class="pi pi-check-circle text-emerald-500"></i>
                <span>Usa el chat para gestionar tus transacciones</span>
              </li>
               <li class="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <i class="pi pi-check-circle text-emerald-500"></i>
                <span>Usa la camara de tu dispositivo para las transacciones</span>
              </li>
            </ul>
          </div>

          <button 
            (click)="installPwa()"
            class="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
            <i class="pi pi-download"></i>
            <span>Instalar Ahora</span>
          </button>
        </app-bottom-sheet-content>
      </app-bottom-sheet>
    }
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class PwaInstallComponent {
  protected readonly pwaService = inject(PwaService);
  protected readonly showPrompt = signal(false);
  protected readonly TitleGradient = TitleGradient;

  showInstallPrompt() {
    this.showPrompt.set(true);
  }

  closePrompt() {
    this.showPrompt.set(false);
  }

  async installPwa() {
    await this.pwaService.installPwa();
    this.closePrompt();
  }
}
