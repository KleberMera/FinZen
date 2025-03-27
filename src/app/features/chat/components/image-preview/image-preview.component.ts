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

  formatFileSize(size: number | undefined): string {
    if (!size) return '0 B';
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    let fileSize = size;
    
    while (fileSize >= 1024 && i < units.length - 1) {
      fileSize /= 1024;
      i++;
    }
    
    return `${fileSize.toFixed(1)} ${units[i]}`;
  }
}
