import { Injectable, inject, signal } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Auth, authState } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ProfileImageService {
  private readonly auth = inject(Auth);
  private readonly sanitizer = inject(DomSanitizer);

  // Señales para la URL de la foto
  protected userPhotoUrl = signal<string>('');
  protected safePhotoUrl = signal<SafeUrl | null>(null);
  protected readonly defaultAvatarUrl = 'favicon.webp';
  // Señal para controlar cuando la imagen no carga
  protected imageError = signal<boolean>(false);

  constructor() {
    this.initializePhotoUrl();
  }

  private initializePhotoUrl(): void {
    authState(this.auth).subscribe((user) => {
      const photoURL = user?.providerData[0]?.photoURL || '';
      console.log('Photo URL:', photoURL);

      if (photoURL) {
        this.userPhotoUrl.set(photoURL);
        // Sanitizar la URL para que Angular la acepte
        this.safePhotoUrl.set(this.sanitizer.bypassSecurityTrustUrl(photoURL));
      } else {
        this.userPhotoUrl.set('');
        this.safePhotoUrl.set(null);
      }
    });
  }

  /**
   * Obtiene la URL segura de la imagen de perfil
   */
  getSafePhotoUrl(): SafeUrl | null {
    return this.safePhotoUrl();
  }

  /**
   * Maneja los errores al cargar la imagen
   */
  handleImageError(): void {
    console.error('Error al cargar la imagen de perfil');
    this.imageError.set(true);
  }

  /**
   * Determina qué URL de imagen mostrar basándose en
   * si existe una foto de usuario y si ha habido errores de carga
   */
  getImageUrl(): string {
    if (this.imageError() || !this.userPhotoUrl()) {
      return this.defaultAvatarUrl;
    }
    return this.userPhotoUrl();
  }

  /**
   * Verifica si hay una URL de foto segura disponible
   */
  hasSafePhotoUrl(): boolean {
    return this.safePhotoUrl() !== null;
  }

  /**
   * Obtiene la URL por defecto para el avatar
   */
  getDefaultAvatarUrl(): string {
    return this.defaultAvatarUrl;
  }
}
