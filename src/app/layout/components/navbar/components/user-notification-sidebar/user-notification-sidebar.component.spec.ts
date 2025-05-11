import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNotificationSidebarComponent } from './user-notification-sidebar.component';

describe('UserNotificationSidebarComponent', () => {
  let component: UserNotificationSidebarComponent;
  let fixture: ComponentFixture<UserNotificationSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserNotificationSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserNotificationSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
