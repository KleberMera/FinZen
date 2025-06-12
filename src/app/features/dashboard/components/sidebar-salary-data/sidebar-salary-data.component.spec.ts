import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarSalaryDataComponent } from './sidebar-salary-data.component';

describe('SidebarSalaryDataComponent', () => {
  let component: SidebarSalaryDataComponent;
  let fixture: ComponentFixture<SidebarSalaryDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarSalaryDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarSalaryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
