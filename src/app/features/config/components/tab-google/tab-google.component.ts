import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-tab-google',
  imports: [],
  templateUrl: './tab-google.component.html',
  styleUrl: './tab-google.component.scss'
})
export default class  TabGoogleComponent {
  // Opciones de sincronización (ejemplo)
  syncOptions = signal([
    { 
      id: 'sync-cloud', 
      label: 'Sincronización Con Google',
      description: 'Inicia Sesión con Google',
      enabled: true 
    },
    // { 
    //   id: 'sync-auto', 
    //   label: 'Sincronización automática', 
    //   description: 'Sincroniza automáticamente cuando haya cambios', 
    //   enabled: true 
    // },
    // { 
    //   id: 'sync-wifi', 
    //   label: 'Solo en WiFi', 
    //   description: 'Sincronizar solo cuando estés conectado a WiFi', 
    //   enabled: false 
    // }
  ]);
}
