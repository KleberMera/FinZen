import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRecordComponent } from './card-record.component';

describe('CardRecordComponent', () => {
  let component: CardRecordComponent;
  let fixture: ComponentFixture<CardRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
