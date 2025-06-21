import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionRecurrentComponent } from './transaction-recurrent.component';

describe('TransactionRecurrentComponent', () => {
  let component: TransactionRecurrentComponent;
  let fixture: ComponentFixture<TransactionRecurrentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionRecurrentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionRecurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
