import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAmortizationComponent } from './card-amortization.component';

describe('CardAmortizationComponent', () => {
  let component: CardAmortizationComponent;
  let fixture: ComponentFixture<CardAmortizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAmortizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAmortizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
