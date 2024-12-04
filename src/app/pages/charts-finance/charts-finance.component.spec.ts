import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsFinanceComponent } from './charts-finance.component';

describe('ChartsFinanceComponent', () => {
  let component: ChartsFinanceComponent;
  let fixture: ComponentFixture<ChartsFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartsFinanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartsFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
