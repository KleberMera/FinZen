import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDebtSummaryComponent } from './card-debt-summary.component';

describe('CardDebtSummaryComponent', () => {
  let component: CardDebtSummaryComponent;
  let fixture: ComponentFixture<CardDebtSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDebtSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardDebtSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
