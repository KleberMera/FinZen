import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionStaticsComponent } from './transaction-statics.component';

describe('TransactionStaticsComponent', () => {
  let component: TransactionStaticsComponent;
  let fixture: ComponentFixture<TransactionStaticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionStaticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionStaticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
