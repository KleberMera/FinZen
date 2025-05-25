import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseDistributionTrendComponent } from './expense-distribution-trend.component';

describe('ExpenseDistributionTrendComponent', () => {
  let component: ExpenseDistributionTrendComponent;
  let fixture: ComponentFixture<ExpenseDistributionTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseDistributionTrendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseDistributionTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
