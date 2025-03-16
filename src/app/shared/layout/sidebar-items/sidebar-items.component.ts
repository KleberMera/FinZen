import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, output, signal, Type } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BookComponent } from '@icons/book/book.component';
import { CashIconComponent } from '@icons/cash-icon/cash-icon.component';
import { CashRegisterIconComponent } from '@icons/cash-register-icon/cash-register-icon.component';
import { OverviewComponent } from '@icons/overview/overview.component';
import { TagComponent } from '@icons/tag/tag.component';
import { menuAnimations } from './menu-animatios';
import { ChatIconComponent } from '@icons/chat-icon/chat-icon.component';


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
  animations: [
    menuAnimations.listAnimation,
    menuAnimations.fadeInAnimation,
    menuAnimations.dropdownAnimation,
    menuAnimations.rotateAnimation
  ]
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
      //activeClass: 'bg-gray-100 dark:bg-gray-700',
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
          label: 'Movimientos',
          route: 'movimientos',
        },

      ],
    },
    {
      type: 'dropdown',
      label: 'Deudas',
      icon: CashIconComponent,
      subItems: [
        {
          label: 'Registro',
          route: 'deudas',
        },
        {
          label: 'Seguimiento',
          route: 'deudas-seguimiento',
        },
      ],
    },
    {
      type: 'dropdown',
      label: 'Metas',
      icon: CashRegisterIconComponent,
      subItems: [
        {
          label: 'Nueva Meta',
          route: 'metas',
        },
               
      ],
    },
    {
      type: 'dropdown',
      label: 'Tickets',
      icon: ChatIconComponent,
      subItems: [
        {
          label: 'Chat',
          route: 'chat',
         // route: 'metas',
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
