import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDebtComponent } from './edit-debt.component';

describe('EditDebtComponent', () => {
  let component: EditDebtComponent;
  let fixture: ComponentFixture<EditDebtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDebtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
