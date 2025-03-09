import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonTableTransactionComponent } from './skeleton-table-transaction.component';

describe('SkeletonTableTransactionComponent', () => {
  let component: SkeletonTableTransactionComponent;
  let fixture: ComponentFixture<SkeletonTableTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonTableTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonTableTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
