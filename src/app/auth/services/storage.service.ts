import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly _storage = localStorage;

  get<T>(key: string): T | null {
    const value = this._storage.getItem(key);
    if (!value) return null;

    return JSON.parse(value) as T;
  }

  set(key: string, value: any) {
    this._storage.setItem(key, JSON.stringify(value));
  }

  remove(key: string) {
    this._storage.removeItem(key);
  }
}
