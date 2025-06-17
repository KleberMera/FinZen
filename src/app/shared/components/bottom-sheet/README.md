# Bottom Sheet Component

Este es un componente reutilizable que implementa un panel deslizante desde la parte inferior de la pantalla en dispositivos móviles y un modal centrado en pantallas más grandes.

## Características

- Animación de deslizamiento desde abajo en dispositivos móviles
- Animación de aparición con escala en dispositivos de escritorio
- Fondo con desenfoque (backdrop blur)
- Diseño responsive
- Soporte para modo oscuro
- Línea de arrastre en la versión móvil

## Componentes

### BottomSheetComponent

Este es el contenedor principal que maneja la animación y el fondo con desenfoque.

```typescript
import { BottomSheetComponent } from '@app/shared/components/bottom-sheet';
```

#### Inputs

- `isOpen: boolean` - Controla si el bottom sheet está abierto o cerrado

#### Outputs

- `closeSheet: EventEmitter<void>` - Se emite cuando se cierra el bottom sheet

### BottomSheetContentComponent

Este componente proporciona la estructura básica para el contenido del bottom sheet, incluyendo un encabezado con título y botón de cierre.

```typescript
import { BottomSheetContentComponent } from '@app/shared/components/bottom-sheet';
```

#### Inputs

- `title: string` - El título que se mostrará en el encabezado

#### Outputs

- `closeSheet: EventEmitter<void>` - Se emite cuando se hace clic en el botón de cierre

## Uso

### Ejemplo básico

```html
<app-bottom-sheet 
  [isOpen]="isBottomSheetOpen()" 
  (closeSheet)="closeBottomSheet()">
  <app-bottom-sheet-content 
    [title]="'Título del Bottom Sheet'" 
    (closeSheet)="closeBottomSheet()">
    <!-- Contenido personalizado aquí -->
    <div class="p-4">
      <p>Este es el contenido del bottom sheet</p>
    </div>
  </app-bottom-sheet-content>
</app-bottom-sheet>
```

### Ejemplo con contenido personalizado

Puedes usar el `BottomSheetComponent` con tu propio componente de contenido personalizado:

```html
<app-bottom-sheet 
  [isOpen]="isBottomSheetOpen()" 
  (closeSheet)="closeBottomSheet()">
  <app-my-custom-content 
    [someData]="data" 
    (someEvent)="handleEvent($event)">
  </app-my-custom-content>
</app-bottom-sheet>
```

## Migración desde componentes existentes

Para migrar un componente existente como `sidebar-deb-details` a usar el nuevo `bottom-sheet`:

1. Actualiza el contenedor para usar `BottomSheetComponent`
2. Adapta el componente de contenido para usar `BottomSheetContentComponent` o úsalo directamente dentro del `BottomSheetComponent`

Consulta los archivos de ejemplo para ver cómo realizar la migración:
- `debt-sidebar-container-example.txt`
- `sidebar-deb-details-example.txt`