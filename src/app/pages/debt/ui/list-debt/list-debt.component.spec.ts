import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDebtComponent } from './list-debt.component';

describe('ListDebtComponent', () => {
  let component: ListDebtComponent;
  let fixture: ComponentFixture<ListDebtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDebtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
