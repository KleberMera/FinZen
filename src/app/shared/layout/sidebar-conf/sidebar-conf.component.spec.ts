import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarConfComponent } from './sidebar-conf.component';

describe('SidebarConfComponent', () => {
  let component: SidebarConfComponent;
  let fixture: ComponentFixture<SidebarConfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarConfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
