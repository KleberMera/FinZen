import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '@services/storage.service';
import { UserProfileService } from '../../services/user-profile.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { tap } from 'rxjs';
import { apiResponse } from '@models/apiResponse';
import { User } from '@models/user';
import { UserProfileSidebarSkeletonComponent } from "../user-profile-sidebar-skeleton/user-profile-sidebar-skeleton.component";

@Component({
  selector: 'app-user-profile-sidebar',
  imports: [CommonModule, ReactiveFormsModule, UserProfileSidebarSkeletonComponent],
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
  protected formUser = this._authService.formUser();

  closeSidebar = output<void>();
  editMode = signal(false);

  public user = rxResource<apiResponse<User>, { userId: number }>({
    request: () => ({ userId: this.seletedUser() }),
    loader: ({ request }) =>
      this._userProfileService.getUserProfile(request.userId).pipe(
        tap((res) => {
          if (res.data) {
            this.formUser().patchValue(res.data);
          }
        })
      ),
  });

  enableEdit() {
    this.editMode.set(true);
  }

  cancelEdit() {
    this.editMode.set(false);

    // Restablecer valores
    //this.nameControl.setValue(this.userData().name);
  }

  logout(){

  }

  saveChanges() {
    this.editMode.set(false);
    console.log(this.formUser().value);
    
  }

  close() {
    this.closeSidebar.emit();
  }
}
