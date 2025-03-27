import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonCardDetailTransactionComponent } from './skeleton-card-detail-transaction.component';

describe('SkeletonCardDetailTransactionComponent', () => {
  let component: SkeletonCardDetailTransactionComponent;
  let fixture: ComponentFixture<SkeletonCardDetailTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonCardDetailTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonCardDetailTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
