import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, output, signal, Type } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BookComponent } from '@icons/book/book.component';
import { CashIconComponent } from '@icons/cash-icon/cash-icon.component';
import { OverviewComponent } from '@icons/overview/overview.component';
import { TagComponent } from '@icons/tag/tag.component';


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
  itemSelected = output<void>();
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
      type: 'link',
      label: 'Categorias',
      icon: TagComponent,
      route: 'categorias',
      activeClass: 'bg-gray-100 dark:bg-gray-700',
    },
    {
      type: 'dropdown',
      label: 'Transacciones',
      icon: BookComponent,
      subItems: [
        {
          label: 'Registro',
          route: 'transacciones',
        },
        {
          label: 'Listado',
          route: 'transacciones-listado',
        },
      ],
    },
    {
      type: 'dropdown',
      label: 'Deudas',
      icon: CashIconComponent,
      subItems: [
        {
          label: 'Nueva Deuda',
          route: 'deudas',
        },
        {
          label: 'Listado',
          route: 'deudas-listado',
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

  onItemClick() {
    this.itemSelected.emit();
  }
}
