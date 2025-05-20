import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAdminService } from '../../services/user-admin.service';
import { StorageService } from '@services/storage.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { SidebarDataUserComponent } from '../../components/sidebar-data-user/sidebar-data-user.component';
import { User } from '@models/user';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule, SidebarDataUserComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
  standalone: true,
})
export default class UserManagementComponent {
  protected readonly _userAdminService = inject(UserAdminService);
  protected readonly _storageService = inject(StorageService);
  selectedUser = signal<User | null>(null);

  isUserDataOpen = signal(false);

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
    () =>
      this.userResource.value()?.data?.filter((user) => user.status === false)
        .length || 0
  );

  onUserDataClick(user: User) {
    this.selectedUser.set(user);
    this.isUserDataOpen.update((value) => !value);
  }

  closeUserData() {
    this.selectedUser.set(null);
    this.isUserDataOpen.set(false);
  }

  changeStatus(user: User) {
    const promise = firstValueFrom(
      this._userAdminService.deleteUser(user.id!, user.status)
    );

    toast.promise(promise, {
      loading: `${user.status ? 'Desactivando' : 'Activando'} usuario...`,
      success: (data) => {
        this.closeUserData();
        this.userResource.reload();
        return data.message;
      },
      error: (error: any) => {
        return error.message;
      },
    });
  }

  deletePermanently(user: User) {
    const promise = firstValueFrom(
      this._userAdminService.deleteUserPermanently(user.id!)
    );

    toast.promise(promise, {
      loading: 'Eliminando usuario permanentemente...',
      success: (data) => {
        this.closeUserData();
        this.userResource.reload();
        return data.message;
      },
      error: (error: any) => {
        return error.message;
      },
    });
  }
}
