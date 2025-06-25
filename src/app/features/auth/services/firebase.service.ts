import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { User } from '@models/user';
import { StorageService } from '../../../shared/services/storage.service';
import { tap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private readonly _auth = inject(Auth);
  private readonly _http = inject(HttpClient);
  private readonly _storage = inject(StorageService);
  private keyUser = signal<string>('user');
  private keyAccessToken = signal<string>('access_token');
  private keyGoogleToken = signal<string>('googletoken');

  // Nuevo método para login con Google
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this._auth, provider);
      const idToken = await result.user.getIdToken();
      // Usar el nuevo endpoint unificado
      const url = `${environment.apiUrl}/firebase/google/signin-or-signup`;
      return this._http.post<apiResponse<User>>(url, { idToken }).pipe(
        tap((res) => {
          console.log(res);
          this._storage.set(this.keyUser(), res.data);
          this._storage.set(this.keyAccessToken(), res.access_token);
        })
      );
    } catch (error) {
      console.error('Error en login con Google:', error);
      throw error;
    }
  }

  loginPostCreate( idToken: string) {
    const url = `${environment.apiUrl}/firebase/google/login`;
      return this._http.post<apiResponse<User>>(url, { idToken }).pipe(
        tap((res) => {
          console.log(res);
          this._storage.set(this.keyUser(), res.data);
          this._storage.set(this.keyAccessToken(), res.access_token);
        })
      );
  }


  // Método para registro con Google
  async signUpWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this._auth, provider);
      const idToken = await result.user.getIdToken();
      const url = `${environment.apiUrl}/firebase/signup`;

      return this._http.post<apiResponse<User>>(url, { idToken }).pipe(
        tap((res) => {
          // this._storage.set(this.keyUser(), res.data);
          //this._storage.set(this.keyAccessToken(), res.access_token);
          //localStorage.setItem('googletoken', idToken);
          this._storage.set(this.keyGoogleToken(), idToken);
        })
      );
    } catch (error) {
      console.error('Error en registro con Google:', error);
      throw error;
    }
  }

  // Método para vincular cuenta con Google
  async linkWithGoogle(userId: number, idToken: string) {
    try {
      const url = `${environment.apiUrl}/firebase/link-google`;
      return this._http.post<apiResponse<any>>(url, { idToken, userId });
    } catch (error) {
      console.error('Error al vincular con Google:', error);
      throw error;
    }
  }
}
