import { Component } from '@angular/core';
import { SidebarItemsComponent } from "../sidebar-items/sidebar-items.component";
import { SidebarConfComponent } from "../sidebar-conf/sidebar-conf.component";

@Component({
  selector: 'app-sidebar',
  imports: [SidebarItemsComponent, SidebarConfComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

}
