import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatText'
})
export class FormatTextPipe implements PipeTransform {

transform(text: string): string {
    if (!text) return '';
    
    return text
      // Convertir **texto** a <strong>texto</strong>
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>')
      // Convertir ***texto*** a <strong>texto</strong> con estilo especial
      .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong class="font-bold text-blue-700 dark:text-blue-300">$1</strong>')
      // Agregar espaciado después de secciones principales
      .replace(/(\*\*[^*]+\*\*)/g, '$1<br><br>')
      // Convertir líneas que empiezan con *** a elementos de lista con estilo
      .replace(/^\*\*\*([^*]+):/gm, '<div class="flex items-start mt-2 mb-1"><span class="text-blue-500 mr-2">•</span><span class="font-semibold text-gray-800 dark:text-gray-200">$1:</span></div>')
      // Envolver contenido después de : en divs con padding
      .replace(/: ([^.\n]+\.)/g, ': <div class="ml-6 text-gray-700 dark:text-gray-300 mb-2">$1</div>')
      // Convertir saltos de línea simples
      .replace(/\n/g, '<br>');
  }
}
