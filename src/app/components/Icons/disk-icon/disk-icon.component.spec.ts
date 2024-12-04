import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiskIconComponent } from './disk-icon.component';

describe('DiskIconComponent', () => {
  let component: DiskIconComponent;
  let fixture: ComponentFixture<DiskIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiskIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiskIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
