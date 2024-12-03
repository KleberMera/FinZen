import { Injectable, signal } from '@angular/core';
export interface ToastMessage {
  type: 'success' | 'danger' | 'warning';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toastSignal = signal<ToastMessage | null>(null);
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'bottom-right';
  toast = this.toastSignal.asReadonly();

  show(message: ToastMessage, options?: { 
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left',
    duration?: number 
  }) {
    if (options?.position) this.position = options.position;
    
    this.toastSignal.set(message);
    
    setTimeout(() => this.dismiss(), options?.duration || 1000);
  }

  dismiss() {
    this.toastSignal.set(null);
  }
}
