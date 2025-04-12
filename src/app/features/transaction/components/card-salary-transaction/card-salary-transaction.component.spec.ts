import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSalaryTransactionComponent } from './card-salary-transaction.component';

describe('CardSalaryTransactionComponent', () => {
  let component: CardSalaryTransactionComponent;
  let fixture: ComponentFixture<CardSalaryTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardSalaryTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardSalaryTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
