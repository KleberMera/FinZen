import { CommonModule } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '@services/storage.service';
import { UserProfileService } from '../../services/user-profile.service';

import { apiResponse } from '@models/apiResponse';
import { User } from '@models/user';
import { UserProfileSidebarSkeletonComponent } from '../user-profile-sidebar-skeleton/user-profile-sidebar-skeleton.component';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { AuthService } from '../../../../../features/auth/services/auth.service';

@Component({
  selector: 'app-user-profile-sidebar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserProfileSidebarSkeletonComponent,
  ],
  templateUrl: './user-profile-sidebar.component.html',
  styleUrl: './user-profile-sidebar.component.scss',
})
export class UserProfileSidebarComponent {
  readonly _storageService = inject(StorageService);

  readonly _userProfileService = inject(UserProfileService);
  protected readonly _authService = inject(AuthService);
  private readonly seletedUser = signal<number>(
    inject(StorageService).getUserId()
  );
  private readonly _router = inject(Router);

  closeSidebar = output<void>();

  public user = rxResource<apiResponse<User>, { userId: number }>({
    request: () => ({ userId: this.seletedUser() }),
    loader: ({ request }) =>
      this._userProfileService.getUserProfile(request.userId),
  });

  logout() {
    this._router.navigate(['auth']);
    //borrar todo de local storage
    const theme = this._storageService.getTheme();
    this._storageService.clear();
    this._storageService.setTheme(theme!);

    toast.success('Sesión cerrada');
    
  }
  isOpen = false;
  close() {
    this.closeSidebar.emit();
    this.isOpen = false;
  }

  
}
