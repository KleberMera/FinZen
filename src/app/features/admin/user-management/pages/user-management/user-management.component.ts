import { Component, inject, signal } from '@angular/core';
import { UserAdminService } from '../../services/user-admin.service';
import { StorageService } from '@services/storage.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-management',
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export default class UserManagementComponent {
  protected readonly _userAdminService = inject(UserAdminService);
  protected readonly _storageService = inject(StorageService);

  userId = signal<number>(this._storageService.getUserId());

  userResource = rxResource({
    request: () => ({ userId: this.userId() }),
    loader: () => this._userAdminService.getAllUsers(),
  });
}
