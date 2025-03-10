import { Component, inject } from '@angular/core';
import { BreakpointService } from '@services/breakpoint.service';
import { SkeletonMobileTransactionComponent } from "../skeleton-mobile-transaction/skeleton-mobile-transaction.component";

@Component({
  selector: 'app-skeleton-table-transaction',
  imports: [SkeletonMobileTransactionComponent],
  template: `
  

@if (_breakS.isMobile()) {
    <app-skeleton-mobile-transaction></app-skeleton-mobile-transaction>

}@else {
    <div
    class="overflow-hidden shadow-xl sm:rounded-lg ring-1 ring-gray-200/50 dark:ring-gray-700/50 bg-white dark:bg-gray-800 animate-pulse">
    <!-- Tabla con scrolling horizontal en dispositivos pequeños -->
    <div class="overflow-x-auto relative">
      <table class="w-full text-sm text-gray-700 dark:text-gray-300">
        <!-- Cabecera con gradiente mejorado -->
        <thead
          class="text-xs uppercase bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 sticky top-0">
          <tr class="border-b border-gray-200/80 dark:border-gray-700">
            <th scope="col"
              class="px-5 py-4 hidden sm:table-cell font-semibold text-gray-600 dark:text-gray-300 align-middle">N°</th>
            <th scope="col" class="px-5 py-4 font-semibold text-gray-600 dark:text-gray-300 align-middle">Categoría</th>
            <th scope="col" class="px-5 py-4 font-semibold text-gray-600 dark:text-gray-300 align-middle">Nombre</th>
            <th scope="col" class="px-5 py-4 font-semibold text-gray-600 dark:text-gray-300 align-middle">Tipo</th>
            <th scope="col"
              class="px-5 py-4 hidden md:table-cell font-semibold text-gray-600 dark:text-gray-300 align-middle">Fecha
            </th>
            <th scope="col" class="px-5 py-4 font-semibold text-gray-600 dark:text-gray-300 text-right align-middle">Monto
            </th>
          </tr>
        </thead>
  
        <!-- Cuerpo de la tabla con filas de skeleton -->
        <tbody class="divide-y divide-gray-200/50 dark:divide-gray-700/30">
          @for (item of [1,2,3,4,5]; track item) {
          <tr class="bg-white dark:bg-gray-800">
            <!-- ID -->
            <td class="px-5 py-4 hidden sm:table-cell">
              <div class="h-5 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </td>
  
            <!-- Categoría -->
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div class="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </td>
  
            <!-- Nombre -->
            <td class="px-5 py-4">
              <div class="h-5 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </td>
  
            <!-- Tipo -->
            <td class="px-5 py-4">
              <div class="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </td>
  
            <!-- Fecha -->
            <td class="px-5 py-4 hidden md:table-cell">
              <div class="flex items-center gap-2">
                <div class="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </td>
  
            <!-- Monto -->
            <td class="px-5 py-4 text-right">
              <div class="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg ml-auto"></div>
            </td>
          </tr>
          }
        </tbody>
  
        <!-- Pie de tabla mejorado -->
        <tfoot
          class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 border-t-2 border-gray-200/80 dark:border-gray-700">
          <tr>
            <td colspan="4" class="text-right px-5 py-2">
              <div class="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div>
            </td>
            <td class="px-5 py-2" colspan="2">
              <div class="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg float-right"></div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  
    <!-- Paginación Mejorada -->
    <div
      class="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <!-- Información de paginación -->
      <div class="mb-4 sm:mb-0">
        <div class="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
  
      <!-- Controles de paginación -->
      <div class="flex items-center space-x-2">
        <!-- Botón página anterior -->
        <div class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
  
        <!-- Botones de páginas -->
        <div class="hidden sm:flex space-x-1">
          @for (btn of [1,2,3,4]; track btn) {
          <div class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          }
        </div>
  
        <!-- Botón página siguiente -->
        <div class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
  
        <!-- Selector de límite por página -->
        <div class="h-8 w-14 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      </div>
    </div>
  </div>
}
  `,
  styleUrl: './skeleton-table-transaction.component.scss'
})
export class SkeletonTableTransactionComponent {

  public readonly _breakS = inject(BreakpointService)

}
