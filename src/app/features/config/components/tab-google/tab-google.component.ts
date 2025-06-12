import { Component, inject, signal, OnInit } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { FirebaseService } from '../../../../features/auth/services/firebase.service';
import { StorageService } from '../../../../services/storage.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-google',
  standalone: true,
  imports: [],
  templateUrl: './tab-google.component.html',
  styleUrl: './tab-google.component.scss'
})
export default class TabGoogleComponent {
  private readonly auth = inject(Auth);
  private readonly firebaseService = inject(FirebaseService);
  private readonly storageService = inject(StorageService);

  isLoading = signal(false);
  isLinked = signal(false);
  hasUserId = signal(false);
  
  syncOptions = signal([
    { 
      id: 'sync-cloud', 
      label: 'Sincronización con Google',
      description: 'Vincular cuenta de Google',
      enabled: true, // Habilitado por defecto si el usuario está autenticado
      action: () => this.linkGoogleAccount()
    },
  ]);

  constructor() {
    this.checkUserId();
  }

  private checkUserId(): void {
    const userId = this.storageService.getUserId();
    this.hasUserId.set(!!userId);
    
    if (!userId) {
      console.warn('No se encontró el ID de usuario en el almacenamiento local');
      return;
    }
    
    // Verificar si ya tiene cuenta de Google vinculada
    const firebaseUid = this.storageService.getFirebaseUserId();
    if (firebaseUid) {
      this.isLinked.set(true);
      this.syncOptions.update(options => 
        options.map(opt => 
          opt.id === 'sync-cloud' 
            ? { ...opt, description: 'Cuenta de Google ya vinculada', enabled: false } 
            : opt
        )
      );
    }
  }

  async linkGoogleAccount() {
    try {
      // Verificar nuevamente el ID de usuario antes de continuar
      this.checkUserId();
      if (!this.hasUserId()) {
        throw new Error('No se pudo verificar la autenticación del usuario');
      }

      this.isLoading.set(true);
      
      // Iniciar autenticación con Google
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const idToken = await result.user.getIdToken();
      
      // Obtener el ID del usuario actual
      const userId = this.storageService.getUserId();
      
      if (!userId) {
        throw new Error('No se pudo obtener el ID del usuario actual');
      }
      
      // Vincular la cuenta de Google
      const response = await this.firebaseService.linkWithGoogle(userId, idToken);
      await firstValueFrom(response);
      
      // Actualizar el estado
      this.isLinked.set(true);
      this.syncOptions.update(options => 
        options.map(opt => 
          opt.id === 'sync-cloud' 
            ? { ...opt, description: 'Cuenta de Google vinculada correctamente', enabled: false } 
            : opt
        )
      );
      
      // Mostrar mensaje de éxito
      console.log('Cuenta de Google vinculada correctamente');
    } catch (error: unknown) {
      console.error('Error al vincular con Google:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('No se pudo vincular la cuenta de Google. Por favor, inténtalo de nuevo. Error:', errorMessage);
    } finally {
      this.isLoading.set(false);
    }
  }
}
