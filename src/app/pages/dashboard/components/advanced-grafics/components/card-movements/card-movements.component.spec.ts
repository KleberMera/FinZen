import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMovementsComponent } from './card-movements.component';

describe('CardMovementsComponent', () => {
  let component: CardMovementsComponent;
  let fixture: ComponentFixture<CardMovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMovementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
