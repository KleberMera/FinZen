import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabService {

  private _activeTab = signal<string>('perfil'); // Tab inicial por defecto
  activeTab = this._activeTab.asReadonly(); // Solo lectura para los consumidores

  setActiveTab(tabId: string): void {
    this._activeTab.set(tabId); // Método para cambiar el tab activo
  }
}
