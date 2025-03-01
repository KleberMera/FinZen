import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

// Signals para la imagen seleccionada
selectedImage = signal<File | null>(null);
selectedImageUrl = signal<string | null>(null);

handleFileSelection(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  
  const file = input.files[0];
  if (file && file.type.match(/image\/*/) && file.size <= 5242880) { // Max 5MB
    this.selectedImage.set(file);
    
    // Crear una URL para la vista previa
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImageUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  } else {
    // Manejar error - archivo no válido o demasiado grande
    console.error('Archivo no válido o demasiado grande');
    // Se podría mostrar un mensaje de error al usuario
  }
}

removeSelectedImage(): void {
  this.selectedImage.set(null);
  this.selectedImageUrl.set(null);
}
}
