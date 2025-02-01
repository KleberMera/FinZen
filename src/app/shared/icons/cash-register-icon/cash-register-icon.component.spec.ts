import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterIconComponent } from './cash-register-icon.component';

describe('CashRegisterIconComponent', () => {
  let component: CashRegisterIconComponent;
  let fixture: ComponentFixture<CashRegisterIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashRegisterIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashRegisterIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
