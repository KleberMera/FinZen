import { Component, OnInit } from '@angular/core';
import { DotLottie } from '@lottiefiles/dotlottie-web';

@Component({
  selector: 'app-chat-icon',
  imports: [],
  templateUrl: './chat-icon.component.html',
  styleUrl: './chat-icon.component.scss'
})
export class ChatIconComponent implements OnInit {
  // Aquí puedes definir propiedades y métodos específicos para el icono de chat

  ngOnInit(): void {
    const dotLottie = new DotLottie({
      autoplay: true,
      loop: true,
      canvas: document.querySelector('#dotlottie-canvas-ia') as HTMLCanvasElement,
      src: "https://lottie.host/1229fd9a-5654-475e-9159-80b621ce306b/FNUinpBrKb.lottie", // Cambiado a .json válido
});
    
  }
}
