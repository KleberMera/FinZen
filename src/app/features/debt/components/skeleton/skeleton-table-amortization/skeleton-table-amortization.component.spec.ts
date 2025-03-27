import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonTableAmortizationComponent } from './skeleton-table-amortization.component';

describe('SkeletonTableAmortizationComponent', () => {
  let component: SkeletonTableAmortizationComponent;
  let fixture: ComponentFixture<SkeletonTableAmortizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonTableAmortizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonTableAmortizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
