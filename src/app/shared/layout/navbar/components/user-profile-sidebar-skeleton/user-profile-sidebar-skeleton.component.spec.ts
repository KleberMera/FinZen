import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileSidebarSkeletonComponent } from './user-profile-sidebar-skeleton.component';

describe('UserProfileSidebarSkeletonComponent', () => {
  let component: UserProfileSidebarSkeletonComponent;
  let fixture: ComponentFixture<UserProfileSidebarSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileSidebarSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileSidebarSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
