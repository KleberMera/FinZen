import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRecurrentComponent } from './card-recurrent.component';

describe('CardRecurrentComponent', () => {
  let component: CardRecurrentComponent;
  let fixture: ComponentFixture<CardRecurrentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardRecurrentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardRecurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
