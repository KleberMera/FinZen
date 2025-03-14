import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonCardAmortizationComponent } from './skeleton-card-amortization.component';

describe('SkeletonCardAmortizationComponent', () => {
  let component: SkeletonCardAmortizationComponent;
  let fixture: ComponentFixture<SkeletonCardAmortizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonCardAmortizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonCardAmortizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
