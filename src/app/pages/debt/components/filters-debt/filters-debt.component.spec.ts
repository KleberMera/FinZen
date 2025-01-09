import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersDebtComponent } from './filters-debt.component';

describe('FiltersDebtComponent', () => {
  let component: FiltersDebtComponent;
  let fixture: ComponentFixture<FiltersDebtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersDebtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltersDebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
