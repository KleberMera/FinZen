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

  detectDevice(): { os: string; browser: string; isMobile: boolean; userAgent: string } {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform;

    // Operating System detection
    let os = 'Unknown';
    if (userAgent.match(/android/i)) {
      os = 'Android';
    } else if (userAgent.match(/iphone|ipad|ipod/i)) {
      os = 'iOS';
    } else if (userAgent.match(/windows/i)) {
      os = 'Windows';
    } else if (userAgent.match(/macintosh|mac os x/i)) {
      os = 'MacOS';
    } else if (userAgent.match(/linux/i)) {
      os = 'Linux';
    }

    // Browser detection
    let browser = 'Unknown';
    if (userAgent.includes('firefox')) {
      browser = 'Firefox';
    } else if (userAgent.includes('edg')) {
      browser = 'Edge';
    } else if (userAgent.includes('chrome')) {
      browser = 'Chrome';
    } else if (userAgent.includes('safari')) {
      browser = 'Safari';
    } else if (userAgent.includes('opera')) {
      browser = 'Opera';
    }

    // Mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    return {
      os,
      browser,
      isMobile,
      userAgent
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

    const device = this.detectDevice();
    console.log('Device detected:', device);
  }
}
