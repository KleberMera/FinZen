import { Component } from '@angular/core';

@Component({
  selector: 'skeleton-filters',
  imports: [],
  template: `
    <div
      class="mb-8 mx-auto p-4 sm:p-6 bg-gray-800 text-white rounded-lg shadow-lg animate-pulse"
    >
      <!-- Título del formulario -->
      <div
        class="flex items-center gap-2 text-xl sm:text-2xl font-bold mb-6 text-blue-400 border-b border-gray-700 pb-3"
      >
        <div class="h-5 w-5 bg-blue-400 rounded"></div>
        <div class="h-8 bg-blue-400 opacity-50 rounded w-48"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <!-- Skeleton para Nombre de la Transacción -->
        <div class="mb-4">
          <div class="h-5 bg-gray-600 rounded w-40 mb-2"></div>
          <div class="relative">
            <div
              class="w-full h-12 rounded-lg bg-gray-700 border border-gray-600"
            ></div>
            <div
              class="absolute left-3 top-3.5 h-5 w-5 bg-gray-500 rounded"
            ></div>
          </div>
        </div>

        <!-- Skeleton para Categoría -->
        <div class="mb-4">
          <div class="h-5 bg-gray-600 rounded w-24 mb-2"></div>
          <div class="relative">
            <div
              class="w-full h-12 rounded-lg bg-gray-700 border border-gray-600"
            ></div>
            <div
              class="absolute left-3 top-3.5 h-5 w-5 bg-gray-500 rounded"
            ></div>
          </div>
        </div>

        <!-- Skeleton para Tipo de Transacción -->
        <div class="mb-4">
          <div class="h-5 bg-gray-600 rounded w-36 mb-2"></div>
          <div class="relative">
            <div
              class="w-full h-12 rounded-lg bg-gray-700 border border-gray-600"
            ></div>
            <div
              class="absolute left-3 top-3.5 h-5 w-5 bg-gray-500 rounded"
            ></div>
            <div
              class="absolute right-3 top-3.5 h-5 w-5 bg-gray-500 rounded"
            ></div>
          </div>
        </div>

        <!-- Skeleton para Filtros Hoy/Todos -->
        <div class="mb-4 flex items-center gap-4">
          <!-- Checkbox Hoy -->
          <div class="inline-flex items-center">
            <div class="w-11 h-6 bg-gray-600 rounded-full relative">
              <div
                class="absolute top-[2px] start-[2px] bg-white rounded-full h-5 w-5"
              ></div>
            </div>
            <div class="ms-3 h-4 bg-gray-600 rounded w-10"></div>
          </div>

          <!-- Checkbox Todos -->
          <div class="inline-flex items-center">
            <div class="w-11 h-6 bg-gray-600 rounded-full relative">
              <div
                class="absolute top-[2px] start-[2px] bg-white rounded-full h-5 w-5"
              ></div>
            </div>
            <div class="ms-3 h-4 bg-gray-600 rounded w-16"></div>
          </div>
        </div>
      </div>

      <!-- Skeleton para Filtro por Fecha -->
      <div class="mt-6 p-4 bg-gray-750 rounded-lg border border-gray-700">
        <div class="flex flex-wrap items-center justify-between mb-4">
          <div class="h-5 bg-gray-600 rounded w-32 mb-2 sm:mb-0"></div>
          <div class="flex gap-4">
            <!-- Radio Fecha Única -->
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-gray-600 rounded-full"></div>
              <div class="h-4 bg-gray-600 rounded w-24"></div>
            </div>
            <!-- Radio Rango de Fechas -->
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-gray-600 rounded-full"></div>
              <div class="h-4 bg-gray-600 rounded w-32"></div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Skeleton para Fecha Única/Rango de Fechas (ambos) -->
          <div class="col-span-full">
            <div class="h-5 bg-gray-600 rounded w-16 mb-2"></div>
            <div class="relative">
              <div
                class="w-full h-12 rounded-lg bg-gray-700 border border-gray-600"
              ></div>
              <div
                class="absolute left-3 top-3.5 h-5 w-5 bg-gray-500 rounded"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skeleton para Botones de acción -->
      <div class="mt-6 flex flex-wrap gap-3 justify-end">
        <div class="h-10 w-24 bg-gray-700 rounded-lg"></div>
        <div class="h-10 w-24 bg-blue-600 opacity-70 rounded-lg"></div>
        <div class="h-10 w-24 bg-blue-600 opacity-70 rounded-lg"></div>
      </div>
    </div>
  `,
  styleUrl: './skeleton-filters.component.scss',
})
export class SkeletonFiltersComponent {}
