import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent {
  title = 'FinZen';

  detectDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform;
  
    // Detección del sistema operativo
    let os = 'Unknown';
    if (/android/.test(userAgent)) os = 'Android';
    else if (/iphone|ipad|ipod/.test(userAgent)) os = 'iOS';
    else if (/windows/.test(userAgent)) os = 'Windows';
    else if (/macintosh|mac os x/.test(userAgent)) os = 'MacOS';
    else if (/linux/.test(userAgent)) os = 'Linux';
  
    // Detección del navegador
    let browser = 'Unknown';
    if (/firefox/.test(userAgent)) browser = 'Firefox';
    else if (/edg/.test(userAgent)) browser = 'Edge';
    else if (/chrome/.test(userAgent)) browser = 'Chrome';
    else if (/safari/.test(userAgent)) browser = 'Safari';
    else if (/opera/.test(userAgent)) browser = 'Opera';
  
    // Detección de dispositivo móvil
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
  
    // Detección de marca y modelo
    let brand = 'Unknown';
    let model = 'Unknown';
  
    if (os === 'Android') {
      const androidMatch = userAgent.match(/android.*;\s*([a-z0-9]+)\s*build/i);
      if (androidMatch) {
        brand = androidMatch[1]; // Ejemplo: "samsung"
        model = androidMatch[1]; // Puede ser más específico según el userAgent
      }
    } else if (os === 'iOS') {
      brand = 'Apple';
      if (/iphone/.test(userAgent)) model = 'iPhone';
      else if (/ipad/.test(userAgent)) model = 'iPad';
      else if (/ipod/.test(userAgent)) model = 'iPod';
    } else if (os === 'Windows' || os === 'MacOS' || os === 'Linux') {
      brand = 'PC'; // Para computadoras, el userAgent no suele dar marca específica
      model = 'Unknown';
    }
  
    return {
      os,
      browser,
      isMobile,
      userAgent,
      brand,
      model
    };
  }

  async ngOnInit() {
    const theme = localStorage.getItem('theme') || 'dark';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    initFlowbite();

    const data = this.detectDevice();
    console.log(data);
    

  }
}
