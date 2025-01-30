import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmortizationViewComponent } from './amortization-view.component';

describe('AmortizationViewComponent', () => {
  let component: AmortizationViewComponent;
  let fixture: ComponentFixture<AmortizationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmortizationViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmortizationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
