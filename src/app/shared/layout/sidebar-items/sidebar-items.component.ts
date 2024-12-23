import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal, Type } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BookComponent } from '@icons/book/book.component';
import { OverviewComponent } from '@icons/overview/overview.component';


interface MenuItem {
  type: 'link' | 'dropdown';
  label: string;
  icon?: Type<any>; // Opcional, puede ser un componente de ícono
  route?: string;
  activeClass?: string;
  subItems?: SubMenuItem[];
  badge?: number;
}

interface SubMenuItem {
  label: string;
  route: string;
  icon?: Type<any>; // Icono opcional para subitems
}
@Component({
  selector: 'app-sidebar-items',
  imports: [RouterLink, RouterLinkActive, NgComponentOutlet],
  templateUrl: './sidebar-items.component.html',
  styleUrl: './sidebar-items.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarItemsComponent {
  // Señal para los elementos del menú
  menuItems = signal<MenuItem[]>([
    {
      type: 'link',
      label: 'Overview',
      icon: OverviewComponent,
      route: 'dashboard',
      activeClass: 'bg-gray-100 dark:bg-gray-700',
    },
    {
      type: 'dropdown',
      label: 'Finanzas',
      icon: BookComponent,
      subItems: [
        {
          label: 'Categorías',
          route: 'categorias',
        },
        {
          label: 'Transacciones',
          route: 'transacciones',
        },
        {
          label: 'Graficas',
          route: 'graficas',
        },
      ],
    },
  ]);

  // Método para alternar menús desplegables
  toggleDropdown(label: string) {
    this.openDropdowns.update((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  }

  // Señales para manejar los menús desplegables
  openDropdowns = signal<string[]>([]);

  // Señal computada para verificar si un dropdown está abierto
  isDropdownOpen = computed(
    () => (label: string) => this.openDropdowns().includes(label)
  );
}
