import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private _storageService = inject(StorageService);

  signOut() {
    this._storageService.remove('access_token');
    this._storageService.remove('user');
  }

  getSession(): string | null {
    let currentSession: string | null = null;

    const maybeSession = this._storageService.getToken();
    if (maybeSession !== null) {
      if (this._isValidSession(maybeSession)) {
        currentSession = maybeSession;
      } else {
        this.signOut();
      }
    }

    return currentSession;
  }

  private _isValidSession(maybeSession: unknown): boolean {
    return typeof maybeSession === 'string' && maybeSession !== null;
  }
}
