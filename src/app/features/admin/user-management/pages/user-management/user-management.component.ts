import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAdminService } from '../../services/user-admin.service';
import { StorageService } from '@services/storage.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
  standalone: true,
})
export default class UserManagementComponent {
  protected readonly _userAdminService = inject(UserAdminService);
  protected readonly _storageService = inject(StorageService);

  userId = signal<number>(this._storageService.getUserId());

  userResource = rxResource({
    request: () => ({ userId: this.userId() }),
    loader: () => this._userAdminService.getAllUsers(),
  });

  ///Usuarios Clientes
  userClient = computed(
    () =>
      this.userResource.value()?.data?.filter((user) => user.rol_id === 2)
        .length || 0
  );


  userInactive = computed(
    () => this.userResource.value()?.data?.filter(user => user.status === false).length || 0
  )
}
