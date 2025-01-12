import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { environment } from '@environments/environment';
import { apiResponse } from '@models/apiResponse';
import { User } from '@models/user';
import { StorageService } from '@services/storage.service';
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

  // Nuevo método para login con Google
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this._auth, provider);
      const idToken = await result.user.getIdToken();
      const url = `${environment.apiUrl}/firebase/google/login`;
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
}