import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarSelectedDebtsComponent } from './sidebar-selected-debts.component';

describe('SidebarSelectedDebtsComponent', () => {
  let component: SidebarSelectedDebtsComponent;
  let fixture: ComponentFixture<SidebarSelectedDebtsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarSelectedDebtsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarSelectedDebtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
