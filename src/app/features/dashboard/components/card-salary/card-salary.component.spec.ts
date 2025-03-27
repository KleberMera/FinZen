import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSalaryComponent } from './card-salary.component';

describe('CardSalaryComponent', () => {
  let component: CardSalaryComponent;
  let fixture: ComponentFixture<CardSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardSalaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
