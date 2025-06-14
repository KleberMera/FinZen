import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '@services/storage.service';
import { UserProfileService } from '../../services/user-profile.service';
import { ProfileImageService } from '@services/profile-image.service';

import { apiResponse } from '@models/apiResponse';
import { User } from '@models/user';
import { UserProfileSidebarSkeletonComponent } from '../user-profile-sidebar-skeleton/user-profile-sidebar-skeleton.component';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { AuthService } from '../../../../../features/auth/services/auth.service';
import { AuthStateService } from '@services/auth-state.service';

@Component({
  selector: 'app-user-profile-sidebar',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    UserProfileSidebarSkeletonComponent,
  ],
  templateUrl: './user-profile-sidebar.component.html',
  styleUrl: './user-profile-sidebar.component.scss',
})
export class UserProfileSidebarComponent {
  readonly _storageService = inject(StorageService);

  readonly _userProfileService = inject(UserProfileService);
  protected readonly _authService = inject(AuthStateService);
  
  private readonly seletedUser = signal<number>(
    inject(StorageService).getUserId()
  );
  private readonly _router = inject(Router);

  closeSidebar = output<void>();

  close() {
    this.closeSidebar.emit();
  }

  public user = rxResource<apiResponse<User>, { userId: number }>({
    request: () => ({ userId: this.seletedUser() }),
    loader: ({ request }) =>
      this._userProfileService.getUserProfile(request.userId),
  });



  protected readonly profileImageService = inject(ProfileImageService);

  constructor() {}

  /**
   * Maneja los errores al cargar la imagen
   */
  handleImageError(): void {
    this.profileImageService.handleImageError();
  }
}
