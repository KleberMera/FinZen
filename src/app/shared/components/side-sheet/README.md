# Side Sheet Component

Este es un componente reutilizable que implementa un panel deslizante lateral que puede abrirse desde la derecha o izquierda de la pantalla.

## Características

- Animación de deslizamiento lateral (derecha o izquierda configurable)
- Fondo con desenfoque (backdrop blur)
- Diseño responsive
- Soporte para modo oscuro
- Estructura de contenido con encabezado y área de contenido

## Uso

```html
<!-- En tu componente padre -->
<app-side-sheet 
  [isOpen]="isSidebarOpen()" 
  [position]="'right'" <!-- o 'left' -->
  (closeSheet)="closeSidebar()">
  <app-side-sheet-content 
    [title]="'Título del Panel'" 
    [titleClasses]="TitleGradient.INDIGO_PURPLE"
    (closeSheet)="closeSidebar()">
    <!-- Tu contenido aquí -->
  </app-side-sheet-content>
</app-side-sheet>
```

## Componentes

### SideSheetComponent

Componente contenedor que maneja la animación y posición del panel lateral.

**Inputs:**
- `isOpen: boolean` - Controla si el panel está abierto o cerrado
- `position: 'left' | 'right'` - Define desde qué lado se abre el panel (por defecto: 'right')

**Outputs:**
- `closeSheet: void` - Evento emitido cuando se hace clic en el fondo oscuro

### SideSheetContentComponent

Componente para el contenido del panel lateral con encabezado y área de contenido.

**Inputs:**
- `title: string` - Título que se muestra en el encabezado
- `titleClasses: string` - Clases adicionales para personalizar el estilo del título

**Outputs:**
- `closeSheet: void` - Evento emitido cuando se hace clic en el botón de cerrar