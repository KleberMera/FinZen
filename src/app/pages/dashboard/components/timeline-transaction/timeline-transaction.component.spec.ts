import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineTransactionComponent } from './timeline-transaction.component';

describe('TimelineTransactionComponent', () => {
  let component: TimelineTransactionComponent;
  let fixture: ComponentFixture<TimelineTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
