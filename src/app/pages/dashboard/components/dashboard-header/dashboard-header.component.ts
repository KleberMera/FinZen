import { Component, inject, signal } from '@angular/core';
import { StorageService } from '@services/storage.service';

@Component({
  selector: 'app-dashboard-header',
  imports: [],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss'
})
export class DashboardHeaderComponent {

  protected readonly storage = inject(StorageService);
  name = signal<string>(this.storage.getName());





}
