import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonDebtsComponent } from './skeleton-debts.component';

describe('SkeletonDebtsComponent', () => {
  let component: SkeletonDebtsComponent;
  let fixture: ComponentFixture<SkeletonDebtsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonDebtsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonDebtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
