import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGoalsComponent } from './card-goals.component';

describe('CardGoalsComponent', () => {
  let component: CardGoalsComponent;
  let fixture: ComponentFixture<CardGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGoalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
