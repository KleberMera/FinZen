import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCategoriesDistributionComponent } from './card-categories-distribution.component';

describe('CardCategoriesDistributionComponent', () => {
  let component: CardCategoriesDistributionComponent;
  let fixture: ComponentFixture<CardCategoriesDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCategoriesDistributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardCategoriesDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
