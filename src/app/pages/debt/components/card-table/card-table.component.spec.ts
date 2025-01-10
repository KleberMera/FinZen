import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTableComponent } from './card-table.component';

describe('CardTableComponent', () => {
  let component: CardTableComponent;
  let fixture: ComponentFixture<CardTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
