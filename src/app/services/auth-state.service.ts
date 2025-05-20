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
    const status = this._storageService.getStatus();
    if (!status) {
      this.signOut();
      return null;
    }

    const maybeSession = this._storageService.getToken();
    if (maybeSession !== null) {
      if (this._isValidSession(maybeSession)) {
        return maybeSession;
      }
    }

    return null;
  }

  private _isValidSession(maybeSession: unknown): boolean {
    return typeof maybeSession === 'string' && maybeSession !== null;
  }
}
