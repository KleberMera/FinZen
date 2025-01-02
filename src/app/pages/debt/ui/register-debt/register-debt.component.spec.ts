import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDebtComponent } from './register-debt.component';

describe('RegisterDebtComponent', () => {
  let component: RegisterDebtComponent;
  let fixture: ComponentFixture<RegisterDebtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterDebtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterDebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
