import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonMobileTransactionComponent } from './skeleton-mobile-transaction.component';

describe('SkeletonMobileTransactionComponent', () => {
  let component: SkeletonMobileTransactionComponent;
  let fixture: ComponentFixture<SkeletonMobileTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonMobileTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonMobileTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
