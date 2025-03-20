import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIconSettingsComponent } from './user-icon-settings.component';

describe('UserIconSettingsComponent', () => {
  let component: UserIconSettingsComponent;
  let fixture: ComponentFixture<UserIconSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserIconSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserIconSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
