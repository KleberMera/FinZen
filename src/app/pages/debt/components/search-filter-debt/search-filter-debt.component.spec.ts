import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFilterDebtComponent } from './search-filter-debt.component';

describe('SearchFilterDebtComponent', () => {
  let component: SearchFilterDebtComponent;
  let fixture: ComponentFixture<SearchFilterDebtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFilterDebtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFilterDebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
