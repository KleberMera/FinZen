import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar-items',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar-items.component.html',
  styleUrl: './sidebar-items.component.scss'
})
export class SidebarItemsComponent {

}
