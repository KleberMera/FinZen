import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAmortizationComponent } from './table-amortization.component';

describe('TableAmortizationComponent', () => {
  let component: TableAmortizationComponent;
  let fixture: ComponentFixture<TableAmortizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableAmortizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableAmortizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
