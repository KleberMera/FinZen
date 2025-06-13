import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
@Pipe({
  name: 'formatText'
})
export class FormatTextPipe implements PipeTransform {

transform(text: string): string {
  if (!text) return '';
  
  // Dividir el texto en líneas para procesarlo mejor
  const lines = text.split('\n');
  const processedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    if (!line) {
      processedLines.push('<div class="mb-2"></div>');
      continue;
    }
    
    // Títulos principales **texto:**
    if (line.match(/^\*\*[^*]+:\*\*$/)) {
      const title = line.replace(/^\*\*([^*]+):\*\*$/, '$1');
      processedLines.push(`<h3 class="font-bold text-lg text-blue-700 dark:text-blue-300 mt-4 mb-3 border-b border-blue-200 dark:border-blue-700 pb-1">${title}</h3>`);
    }
    // Subtítulos **texto:**
    else if (line.match(/^\*\*[^*]+:$/)) {
      const subtitle = line.replace(/^\*\*([^*]+):$/, '$1');
      processedLines.push(`<h4 class="font-semibold text-base text-gray-800 dark:text-gray-200 mt-3 mb-2">${subtitle}:</h4>`);
    }
    // Líneas que solo tienen *
    else if (line === '*') {
      // Ignorar líneas que solo tienen asterisco
      continue;
    }
    // Líneas que empiezan con * y tienen contenido
    else if (line.startsWith('*') && line.length > 1) {
      const content = line.replace(/^\*\s*/, '');
      
      // Procesar contenido que puede tener formato **texto** dentro de la lista
      let processedContent = content
        .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em class="text-blue-600 dark:text-blue-400 font-medium">$1</em>');
      
      // Si termina con .* significa que continúa
      if (content.endsWith('.*')) {
        const cleanContent = processedContent.replace(/\.\*$/, '');
        processedLines.push(`<div class="flex items-start mt-2 mb-1"><span class="text-blue-500 dark:text-blue-400 mr-2 mt-1">▸</span><span class="text-gray-700 dark:text-gray-300">${cleanContent}</span></div>`);
      } else {
        processedLines.push(`<div class="flex items-start mt-2 mb-1"><span class="text-green-500 dark:text-green-400 mr-2 mt-1">•</span><span class="text-gray-700 dark:text-gray-300">${processedContent}</span></div>`);
      }
    }
    // Texto normal que puede tener formato *texto*
    else {
      let processedLine = line
        // Convertir **texto** a negrita (procesando primero para evitar conflictos)
        .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>')
        // Convertir *texto* a cursiva
        .replace(/\*([^*]+)\*/g, '<em class="text-blue-600 dark:text-blue-400 font-medium">$1</em>');
      
      // Si es una pregunta, darle formato especial
      if (processedLine.includes('?')) {
        processedLines.push(`<div class="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg mt-3 border-l-4 border-yellow-400"><span class="font-medium text-yellow-800 dark:text-yellow-200">${processedLine}</span></div>`);
      }
      // Si termina con exclamación, formato especial
      else if (processedLine.endsWith('!')) {
        processedLines.push(`<div class="text-center bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mt-3 mb-2"><span class="font-semibold text-blue-800 dark:text-blue-200">${processedLine}</span></div>`);
      }
      // Texto normal
      else {
        processedLines.push(`<p class="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">${processedLine}</p>`);
      }
    }
  }
  
  return processedLines.join('');
}
}
