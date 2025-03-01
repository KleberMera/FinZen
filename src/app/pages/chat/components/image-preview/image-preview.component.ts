import { Component, inject } from '@angular/core';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-image-preview',
  imports: [],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.scss'
})
export class ImagePreviewComponent {
  private imageService = inject(ImageService);
  
  get selectedImage() {
    return this.imageService.selectedImage;
  }
  
  get selectedImageUrl() {
    return this.imageService.selectedImageUrl;
  }
  
  removeSelectedImage(): void {
    this.imageService.removeSelectedImage();
  }
}
