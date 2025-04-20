import { Injectable, signal } from '@angular/core';
import { User } from '@models/user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly _storage = localStorage;
  private readonly _userId = signal<string>('user');
  private readonly _token = signal<string>('access_token');

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

  getUserId() {
    const dataUser: User | null = this.get(this._userId());
    // recorrer dataUser y retornar el  id
    return dataUser?.id as number;
  }

  getName() {
    const dataUser: User | null = this.get(this._userId());
    return dataUser ? `${dataUser.name} ${dataUser.last_name}` : '';
  }

  getAvatar() {
    const dataUser: User | null = this.get(this._userId());
    // recorrer dataUser y retornar el  id
    return dataUser?.avatar as string;
  }

  // Método para borrar todos los datos de la sesión
  clear() {
    this._storage.clear();
  }

  setTheme(theme: string) {
    this._storage.setItem('theme', theme);
  }

  getTheme() {
    return this._storage.getItem('theme');
  }

  getToken() {
    const token = this._storage.getItem(this._token());
    return token ? JSON.parse(token) : null;
  }
}
