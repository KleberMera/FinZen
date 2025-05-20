import { Component, input, output, signal } from '@angular/core';
import { User } from '@models/user';

@Component({
  selector: 'app-sidebar-data-user',
  imports: [],
  templateUrl: './sidebar-data-user.component.html',
  styleUrl: './sidebar-data-user.component.scss',
})
export class SidebarDataUserComponent {
  closeUserData = output<void>();
  userData = input<User>();

  close() {
    this.closeUserData.emit();
  }

  ngOnInit() {
    console.log(this.userData());
  }
}
