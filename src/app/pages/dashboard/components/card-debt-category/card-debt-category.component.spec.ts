import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDebtCategoryComponent } from './card-debt-category.component';

describe('CardDebtCategoryComponent', () => {
  let component: CardDebtCategoryComponent;
  let fixture: ComponentFixture<CardDebtCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDebtCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardDebtCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
