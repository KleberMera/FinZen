import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarDebDetailsComponent } from './sidebar-deb-details.component';

describe('SidebarDebDetailsComponent', () => {
  let component: SidebarDebDetailsComponent;
  let fixture: ComponentFixture<SidebarDebDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarDebDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarDebDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
